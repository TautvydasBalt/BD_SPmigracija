using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using PnP.Framework;
using System.Security;
using Microsoft.SharePoint.Client;
using PnP.Core.Model.SharePoint;
using BDTB_SPMigration.Models;
using System.Collections.Generic;
using PnP.Framework.Modernization.Cache;
using Microsoft.SharePoint.Client.WebParts;
using File = Microsoft.SharePoint.Client.File;
using System.IO;
using AngleSharp.Text;
using System.Text.Json.Serialization;
using Newtonsoft.Json.Linq;
using System.Linq;
using PnP.Framework.Entities;
using MySqlX.XDevAPI.Relational;
using System.Data.Common;

namespace BDTB_SPMigration.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SharePointController : ControllerBase
    {
        private readonly ILogger<SharePointController> _logger;
        public SharePointController(ILogger<SharePointController> logger)
        {
            _logger = logger;
        }
        private ClientContext getClientContext(string userLogin, string userPassword, string siteUrl)
        {
            SecureString passw = new SecureString();
            try
            {
                if (userPassword != null)
                {
                    foreach (char c in userPassword.ToCharArray())
                    {
                        passw.AppendChar(c);
                    }
                    AuthenticationManager auth = new AuthenticationManager(userLogin, passw);
                    return auth.GetContext(siteUrl);
                }
                else return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return null;
            }
        }

        [HttpGet]
        public SharePointUser Get(string userLogin, string userPassword, string siteUrl)
        {
            using (ClientContext ctx = getClientContext(userLogin, userPassword, siteUrl))
            {
                if (ctx == null) return null;
                ctx.Load(ctx.Web);
                ctx.ExecuteQuery();
                ctx.Load(ctx.Web.CurrentUser);
                ctx.ExecuteQuery();
                return new SharePointUser
                {
                    SiteCollectionName = ctx.Web.Title,
                    CurrentDate = DateTime.Today,
                    DisplayName = ctx.Web.CurrentUser.Title,
                    Email = ctx.Web.CurrentUser.Email,
                    LoginName = ctx.Web.CurrentUser.LoginName
                };
            };
        }

        [HttpGet("getSPPages")]
        public List<SharepointPage> GetSPPages(string userLogin, string userPassword, string siteUrl)
        {
            using (ClientContext ctx = getClientContext(userLogin, userPassword, siteUrl))
            {
                if (ctx == null) return null;
                ctx.Load(ctx.Web);
                List<SharepointPage> sharepointPages = new List<SharepointPage>();
                ctx.Load(ctx.Web);
                ctx.ExecuteQuery();
                ListItemCollection pages = ctx.Web.GetPages();

                ctx.ExecuteQuery();
                ctx.Load(pages, page => page.Include(
                    i => i.Id,
                    i => i.DisplayName
                    ));
                ctx.ExecuteQuery();

                foreach (Microsoft.SharePoint.Client.ListItem page in pages)
                {
                    SharepointPage spPage = new SharepointPage
                    {
                        Id = page.Id,
                        Title = page.DisplayName
                    };
                    sharepointPages.Add(spPage);
                }
                return sharepointPages;
            }
        }

        [HttpPost("MigratePages")]
        public string MigratePages([FromBody] Migration migration)
        {
            using (ClientContext ctxSource = getClientContext(migration.SourceUsername, migration.SourcePassword, migration.SourceURL))
            {
                using (ClientContext ctxDestination = getClientContext(migration.DestinationUsername, migration.DestinationPassword, migration.DestinationURL))
                {
                    ctxSource.Load(ctxSource.Web);

                    // Get the pages from the source site
                    ListItemCollection pages = ctxSource.Web.GetPages();
                    ctxSource.Load(pages, page => page.Include(i => i.DisplayName));
                    ctxSource.ExecuteQuery();

                    // Copy the pages to the destination site
                    foreach (ListItem page in pages)
                    {
                        File pageFile = page.File;
                        ctxSource.Load(pageFile);
                        ctxSource.ExecuteQuery();

                        IPage realpage = ctxSource.Web.LoadClientSidePage(page.DisplayName);
                        ctxSource.ExecuteQuery();
                        MigratePageLists(realpage, ctxSource, ctxDestination);
                           
                        string pageName = pageFile.Name;
                        ClientResult<Stream> stream = pageFile.OpenBinaryStream();
                        ctxSource.ExecuteQuery();

                        byte[] fileContent;
                        using (var memoryStream = new MemoryStream())
                        {
                            stream.Value.CopyTo(memoryStream);
                            fileContent = memoryStream.ToArray();
                        }

                        FileCreationInformation createPage = new FileCreationInformation();
                        createPage.Content = fileContent;
                        createPage.Url = pageName;
                        createPage.Overwrite = true;

                        Folder pagesLibrary = ctxDestination.Web.Lists.GetByTitle("Site Pages").RootFolder;
                        File newPageFile = pagesLibrary.Files.Add(createPage);
                        ctxDestination.Load(newPageFile);
                        ctxDestination.ExecuteQuery();
                    }

                    return "Pages migration completed successfully.";
                }
            }
        }

        private void MigratePageLists(IPage realpage, ClientContext ctxSource, ClientContext ctxDest)
        {
            List<ICanvasSection> sections = realpage.Sections;
            foreach (ICanvasSection section in sections)
            {
                List<ICanvasControl> controls = section.Controls;
                foreach (var control in controls)
                {
                    IPageWebPart webPart = (IPageWebPart)control;
                    if (webPart.Title == "List")
                    {
                        dynamic data = JObject.Parse(webPart.PropertiesJson);
                        string path = data.webRelativeListUrl;

                        // Get the list from the source site
                        List list = ctxSource.Web.Lists.GetByTitle(path.Split('/').Last());
                        ctxSource.Load(list);
                        ctxSource.ExecuteQuery();

                        // Create a new list on the destination site
                        ListCreationInformation createList = new ListCreationInformation();
                        createList.Description = list.Description;
                        createList.TemplateType = list.BaseTemplate;
                        createList.Title = list.Title;
                        List newList = ctxDest.Web.Lists.Add(createList);
                        ctxDest.Load(newList);
                        ctxDest.ExecuteQuery();

                        // Copy the list columns
                        ctxSource.Load(list, l => l.Fields);
                        ctxSource.ExecuteQuery();

                        List<string> columnList = new List<string>();
                        foreach (Field column in list.Fields)
                        {
                            if (!column.ReadOnlyField && column.InternalName != "Attachments") columnList.Add(column.InternalName);
                            if (!column.ReadOnlyField && !newList.FieldExistsByName(column.InternalName))
                            {
                                ctxSource.Load(column, f => f.Title, f => f.ReadOnlyField, f => f.FieldTypeKind, f => f.InternalName, f => f.SchemaXmlWithResourceTokens);
                                ctxSource.ExecuteQuery();

                                // Create a new column in the destination list
                                FieldCreationInformation fieldInfo = new FieldCreationInformation(column.FieldTypeKind.ToString());
                                fieldInfo.DisplayName = column.Title;
                                fieldInfo.InternalName = column.InternalName;

                                // Add the new field to the destination list
                                Field newField = newList.Fields.AddFieldAsXml(column.SchemaXmlWithResourceTokens, true, AddFieldOptions.AddFieldInternalNameHint);
                                ctxDest.Load(newField);
                                ctxDest.ExecuteQuery();
                            }
                        }

                        // Copy the list items to the new list
                        CamlQuery query = CamlQuery.CreateAllItemsQuery();
                        ListItemCollection items = list.GetItems(query);
                        ctxSource.Load(items);
                        ctxSource.ExecuteQuery();
                        int limit = 100;
                        int count = 0;

                        foreach (ListItem item in items)
                        {
                            ListItemCreationInformation createItem = new ListItemCreationInformation();
                            createItem.UnderlyingObjectType = item.FileSystemObjectType;
                            ListItem newItem = newList.AddItem(createItem);

                            // Copy the field values from the source item to the new item
                            foreach (var field in item.FieldValues)
                            {
                                if (columnList.Contains(field.Key) && field.Value != null)
                                {
                                    //Console.WriteLine("KEY: " + field.Key + " VALUE: " + field.Value);
                                    newItem[field.Key] = field.Value; 
                                }
                            }

                            newItem.Update();
                            count++;

                            if (count > limit)
                            {
                                ctxDest.ExecuteQuery();
                                count = 0;
                            }
                        }
                        ctxDest.ExecuteQuery();
                    }
                }
            }
        }
    }

    //[HttpGet("getSharepointLists")]
    //public List<SharepointList> GetSharepointLists(string userLogin, string userPassword, string siteUrl)
    //{
    //    using (ClientContext ctx = getClientContext(userLogin, userPassword, siteUrl))
    //    {
    //        ctx.Load(ctx.Web);
    //        ctx.ExecuteQuery();
    //        ctx.Load(ctx.Web.Lists, lists => lists.Include(list => list.Id, list => list.Title));
    //        ctx.ExecuteQuery();
    //        List<SharepointList> data = new List<SharepointList>();
    //        foreach (var list in ctx.Web.Lists)
    //        {
    //            SharepointList splist = new SharepointList
    //            {
    //                Id = list.Id,
    //                Title = list.Title,
    //            };
    //            data.Add(splist);
    //        }
    //        return data;
    //    }
    //}
}
