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

namespace BDTB_SPMigration.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SharePointUserController : ControllerBase
    {
        private readonly ILogger<SharePointUserController> _logger;
        public SharePointUserController(ILogger<SharePointUserController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public SharePointUser Get(string userLogin, string userPassword, string siteUrl)
        {

            SecureString passw = new SecureString();
            foreach (char c in userPassword.ToCharArray())
            {
                passw.AppendChar(c);
            }
            AuthenticationManager auth = new AuthenticationManager(userLogin, passw);
            using (var ctx = auth.GetContext(siteUrl)) {

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

        [HttpGet("getSharepointLists")]
        public List<SharepointList> GetSharepointLists(string userLogin, string userPassword, string siteUrl)
        {

            SecureString passw = new SecureString();
            foreach (char c in userPassword.ToCharArray())
            {
                passw.AppendChar(c);
            }
            AuthenticationManager auth = new AuthenticationManager(userLogin, passw);

            using (ClientContext ctx = auth.GetContext(siteUrl))
            {
                ctx.Load(ctx.Web);
                ctx.ExecuteQuery();
                ctx.Load(ctx.Web.Lists,lists => lists.Include(list => list.Id, list => list.Title));
                ctx.ExecuteQuery();

                List<SharepointList> data = new List<SharepointList>();

                foreach (var list in ctx.Web.Lists)
                {
                    SharepointList splist = new SharepointList {
                        Id = list.Id,
                        Title = list.Title,
                    };
                    data.Add(splist);
                }
                return data;
            }
        }
    }
}
