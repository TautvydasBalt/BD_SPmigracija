using BDTB_SPMigration.Models;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;

namespace BDTB_SPMigration.Controllers
{
    public class MigrationHistoryController : Controller
    {
        private readonly string connectionString = "server=localhost;port=3306;user=root;database=bdtb_spmigration";

        [HttpPost("archiveMigration")]
        public bool archiveMigration([FromBody] MigrationHistory requestjson)
        {
            using MySqlConnection connection = new MySqlConnection(connectionString);
            try
            {
                connection.Open();
                string query = "INSERT INTO migration_history (title, source_url, destination_url, migration_date, status) VALUES (@request_name, @source_url, @destination_url, @migration_date, @status)";

                MySqlCommand command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@request_name", requestjson.Title);
                command.Parameters.AddWithValue("@source_url", requestjson.SourceURL);
                command.Parameters.AddWithValue("@destination_url", requestjson.DestinationURL);
                command.Parameters.AddWithValue("@migration_date", requestjson.migrationDate);
                command.Parameters.AddWithValue("@status", requestjson.Status);

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

        [HttpGet("migrationHistory")]
        public List<MigrationHistory> GetMigrationHistory()
        {
            List<MigrationHistory> requests = new List<MigrationHistory>();
            using MySqlConnection connection = new MySqlConnection(connectionString);
            connection.Open();

            string query = "SELECT ID, title, source_url, destination_url, status, migration_date FROM migration_history";
            using MySqlCommand command = new MySqlCommand(query, connection);
            using MySqlDataReader reader = command.ExecuteReader();
            while (reader.Read())
            {
                requests.Add(new MigrationHistory
                {
                    ID = reader.GetInt32(0),
                    Title = reader.GetString(1),
                    SourceURL = reader.GetString(2),
                    DestinationURL = reader.GetString(3),
                    Status = reader.GetString(4),
                    migrationDate = reader.GetDateTime(5)
                });
            }
            return requests;
        }

        [HttpDelete("deleteMigrationHistory")]
        public bool deleteMigrationHistory(int id)
        {
            using MySqlConnection connection = new MySqlConnection(connectionString);
            try
            {
                connection.Open();
                string query = "DELETE FROM migration_history WHERE ID = @id";
                MySqlCommand command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@id", id);
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
