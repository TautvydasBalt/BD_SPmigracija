using System.Collections.Generic;

namespace BDTB_SPMigration.Models
{
    public class Migration
    {
        public string SourceURL { get; set; }
        public string SourceUsername { get; set; }
        public string SourcePassword { get; set; }
        public string DestinationURL { get; set; }
        public string DestinationUsername { get; set; }
        public string DestinationPassword { get; set; }
        public List<SharepointPage> SharepointPages { get; set; }
    }
}
