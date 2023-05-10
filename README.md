# SharePoint Page migration tool

This repository holds the source code and database structure for a sharepoint page migration tool.

This tool supports migrating pages between two diferrent SharePoint Online sites.

Install guide:

1. Clone the repository.
2. Install the required dependencies:
  node.js v16.19.1
  npm 8.19.3
  MySQL 8.*.*
  .NET 7
  VisualStudio 2022 (or other NuGet package tool)

3. Import the .sql file to the DB
4. Open BD_SPmigration\BDTB_SPMigration service\BDTB_SPMigration.sln with VisualStudio and install the following NuGet packages if needed:
  Microsoft.SharePointOnline.CSOM 16.1.23508.12000
  MySql.Data 8.0.33
  Newtonsoft.Json 13.0.3
  PnP.Core 1.9.0
  PnP.Framework 1.12.0
  Swashbuckle.AspNetCore 6.5.0
  
5. Open BD_SPmigration\spmm-app directory in console apllication and type npm -install

6. Thats it the tool is setup in your local machine.
