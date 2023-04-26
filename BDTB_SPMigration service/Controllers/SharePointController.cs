using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using PnP.Framework;
using System.Security;
using Microsoft.SharePoint.Client;
using PnP.Core.Model.SharePoint;
using Google.Protobuf.Collections;
using BDTB_SPMigration.Models;
using System.Collections.Generic;
using System.Linq;
using PnP.Framework.Modernization.Cache;
using Microsoft.SharePoint.Client.WebParts;

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
            foreach (char c in userPassword.ToCharArray())
            {
                passw.AppendChar(c);
            }
            AuthenticationManager auth = new AuthenticationManager(userLogin, passw);
            return auth.GetContext(siteUrl);
        }

        [HttpGet]
        public SharePointUser Get(string userLogin, string userPassword, string siteUrl)
        {
            using (ClientContext ctx = getClientContext(userLogin, userPassword, siteUrl))
            {
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

                foreach (ListItem page in pages)
                {
                    SharepointPage spPage = new SharepointPage{
                        Id = page.Id,
                        Title = page.DisplayName
                    };
                    sharepointPages.Add(spPage);
                }
                return sharepointPages;
            }
        }

        [HttpGet("SPTesting")]
        public string SPTesting(string userLogin, string userPassword, string siteUrl)
        {
            using (ClientContext ctx = getClientContext(userLogin, userPassword, siteUrl))
            {
                ctx.Load(ctx.Web);
                ctx.ExecuteQuery();
                ListItemCollection pages = ctx.Web.GetPages();

                ctx.ExecuteQuery();
                ctx.Load(pages, page => page.Include(
                    i => i.Id,
                    i => i.DisplayName
                    ));
                ctx.ExecuteQuery();

                foreach (ListItem page in pages)
                {
                    IPage realpage = ctx.Web.LoadClientSidePage(page.DisplayName);
                    ctx.ExecuteQuery();

                    //ctx.Web.CreateSitePage("");
                    //IPageHeader header = realpage.PageHeader;
                    //Console.WriteLine(realpage.PnPContext);

                    //Console.WriteLine(realpage.LayoutType.ToString()); //gal

                    List <ICanvasSection> sections = realpage.Sections; //REIKIA
                    Console.WriteLine(sections.Count);

                    List<ICanvasColumn> canvasColumns = sections[0].Columns;
                    Console.WriteLine(canvasColumns.Count);

                    List<ICanvasControl> controls = sections[0].Controls;//Reikia
                    Console.WriteLine(controls.Count);

                    foreach (var control in controls)
                    {
                        IPageWebPart webPart = (IPageWebPart)control;
                        Console.WriteLine("Title: " + webPart.Title);
                        Console.WriteLine("Description: " + webPart.Description);
                        Console.WriteLine("WebPartId: " + webPart.WebPartId);
                        Console.WriteLine("Properties: " + webPart.Properties);
                        Console.WriteLine("DynamicDataValues: " + webPart.DynamicDataValues);
                        Console.WriteLine("WebPartData: " + webPart.WebPartData);
                    }


                }

                return "";
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
