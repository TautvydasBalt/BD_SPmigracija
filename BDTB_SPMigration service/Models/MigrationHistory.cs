using System;

namespace BDTB_SPMigration.Models
{
    public class MigrationHistory
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string SourceURL { get; set; }
        public string DestinationURL { get; set; }
        public DateTime migrationDate { get; set; }
        public string Status { get; set; }

    }
}
