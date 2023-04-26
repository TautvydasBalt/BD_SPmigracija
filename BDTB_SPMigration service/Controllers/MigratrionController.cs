using BDTB_SPMigration.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph;
using MySql.Data.MySqlClient;
using System;

namespace BDTB_SPMigration.Controllers
{
    public class MigratrionController : Controller
    {
        // Database connection string
        private readonly string connectionString = "server=localhost;port=3306;user=root;database=bdtb_spmigration";

        [HttpPost("startMigrationToSharePointOnline")]
        public bool startMigrationToSharePointOnline([FromBody] MigrationRequest requestjson)
        {
            try
            {
                markMigrationStarted(requestjson.ID);
                
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
            
        }

        public bool markMigrationStarted(int id)
        {
            using MySqlConnection connection = new MySqlConnection(connectionString);
            try
            {
                connection.Open();
                string query = "UPDATE migration_request SET status = @status WHERE ID = @id";
                using MySqlCommand command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@id", id);
                command.Parameters.AddWithValue("@status", "Started");
                int rowsAffected = command.ExecuteNonQuery();
                if (rowsAffected > 0) return true;
                else return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }
        public bool markMigrationCompleted(int id)
        {
            using MySqlConnection connection = new MySqlConnection(connectionString);
            try
            {
                connection.Open();
                string query = "UPDATE migration_request SET status = @status WHERE ID = @id";
                using MySqlCommand command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@id", id);
                command.Parameters.AddWithValue("@status", "Completed");
                int rowsAffected = command.ExecuteNonQuery();
                if (rowsAffected > 0) return true;
                else return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }
    }
}
