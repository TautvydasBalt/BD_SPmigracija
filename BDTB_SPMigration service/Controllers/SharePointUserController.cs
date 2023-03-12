using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using PnP.Framework;
using System.Security;

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
        public SharePointUser Get(string userLogin, string userPassword)
        {
            string siteUrl = "https://tautbdev.sharepoint.com/sites/devsite";
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
    }
}
