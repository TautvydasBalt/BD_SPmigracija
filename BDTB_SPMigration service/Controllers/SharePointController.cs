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
                    //List pagesList = ctxSource.Web.Lists.GetByTitle("Site Pages");
                    //CamlQuery query = CamlQuery.CreateAllItemsQuery();
                    ListItemCollection pages = ctxSource.Web.GetPages();
                    ctxSource.Load(pages, page => page.Include(i => i.DisplayName));
                    ctxSource.ExecuteQuery();

                    // Copy the pages to the destination site
                    foreach (ListItem page in pages)
                    {
                        File pageFile = page.File;
                        ctxSource.Load(pageFile);
                        ctxSource.ExecuteQuery();

                        // Todo: Get the web parts on the page
                        IPage realpage = ctxSource.Web.LoadClientSidePage(page.DisplayName);
                        ctxSource.ExecuteQuery();
                        GetWebpartNames(realpage);

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

        private void GetWebpartNames(IPage realpage)
        {
            List<ICanvasSection> sections = realpage.Sections;
            foreach (ICanvasSection section in sections)
            {
                List<ICanvasControl> controls = section.Controls;
                foreach (var control in controls)
                {
                    IPageWebPart webPart = (IPageWebPart)control;
                    Console.WriteLine("Title: " + webPart.Title);
                    if (webPart.Title == "List")
                    {
                        dynamic data = JObject.Parse(webPart.PropertiesJson);
                        Console.WriteLine(data.webRelativeListUrl);
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
