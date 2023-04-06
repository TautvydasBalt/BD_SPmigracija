using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;

namespace BDTB_SPMigration
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "BDTB_SPMigration", Version = "v1" });
            });

            services.AddCors(options =>
            {
                options.AddPolicy(name: MyAllowSpecificOrigins,
                              builder =>
                              {
                                  builder.AllowAnyOrigin()
                                         .AllowAnyHeader()
                                         .AllowAnyMethod();
                              });

            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "BDTB_SPMigration v1"));
            }
            
            app.UseHttpsRedirection();
            //app.UseStaticFiles();
            app.UseRouting();

            app.UseCors(MyAllowSpecificOrigins);

            app.UseAuthorization();
            app.UseAuthentication();
            //app.Use(async (context, next) =>
            //{
            //    context.Response.Headers.Add("Access-Control-Allow-Origin","*");
            //    context.Response.Headers.Add("Access-Control-Allow-Methods", "GET, OPTIONS, PUT, POST, DELETE");
            //    context.Response.Headers.Add("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
            //    context.Response.Headers.Add("Access-Control-Allow-Credentials", "true");
            //    await next();
            //});
            //app.UseEndpoints(endpoints =>
            //{
            //    endpoints.MapControllers();
            //});
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
                //endpoints.MapControllers()
                //     .RequireCors(MyAllowSpecificOrigins);
            });
        }
    }
}
