using System.Collections.Generic;

namespace BDTB_SPMigration.Models
{
    public class MigrationRequest
    {
        public int ID { get; set; }
        public string RequestName { get; set; }
        public string SourceURL { get; set; }
        public string DestinationURL { get; set; }
        public string Status { get; set; }
        public List<User> AssignedUsers { get; set; }
        public List<SharepointList> sharepointLists { get; set; }
    }
}
