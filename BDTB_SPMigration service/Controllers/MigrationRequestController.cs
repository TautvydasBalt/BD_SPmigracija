using BDTB_SPMigration.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;

namespace BDTB_SPMigration.Controllers
{
    public class MigrationRequestController : Controller
    {
        // Database connection string
        private readonly string connectionString = "server=localhost;port=3306;user=root;database=bdtb_spmigration";

        [HttpGet("allRequests")]
        public List<MigrationRequest> GetAllRequests()
        {
            List<MigrationRequest> requests = new List<MigrationRequest>();
            using MySqlConnection connection = new MySqlConnection(connectionString);
            connection.Open();
            string query = "SELECT ID, request_name, source_url, destination_url FROM migration_request";
            using MySqlCommand command = new MySqlCommand(query, connection);
            using MySqlDataReader reader = command.ExecuteReader();
            while (reader.Read())
            {
                requests.Add(new MigrationRequest
                {
                    ID = reader.GetInt32(0),
                    RequestName = reader.GetString(1),
                    SourceURL = reader.GetString(2),
                    DestinationURL = reader.GetString(3)
                });
            }
            return requests;
        }

        [HttpGet("viewRequest")]
        public MigrationRequest viewRequest(int id)
        {
            using MySqlConnection connection = new MySqlConnection(connectionString);
            try
            {
                connection.Open();
                string query = "SELECT * FROM migration_request WHERE id=@id";

                MySqlCommand command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@id", id);
                MySqlDataReader reader = command.ExecuteReader();

                if (reader.HasRows)
                {
                    MigrationRequest migrationRequest = new MigrationRequest();
                    reader.Read();
                    migrationRequest.ID = reader.GetInt32(0);
                    migrationRequest.RequestName = reader.GetString(1);
                    migrationRequest.SourceURL = reader.GetString(2);
                    migrationRequest.DestinationURL = reader.GetString(3);
                    reader.Close();
                    return migrationRequest;
                }
                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        [HttpPost("createRequest")]
        public bool createRequest(string RequestName, string SourceURL, string DestinationURL)
        {
            using MySqlConnection connection = new MySqlConnection(connectionString);
            try
            {
                connection.Open();
                string query = "INSERT INTO migration_request (request_name, source_url, destination_url) VALUES (@request_name, @source_url, @destination_url)";

                MySqlCommand command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@request_name", RequestName);
                command.Parameters.AddWithValue("@source_url", SourceURL);
                command.Parameters.AddWithValue("@destination_url", DestinationURL);

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

        [HttpPut("updateRequest")]
        public bool updateRequest(MigrationRequest request)
        {
            using MySqlConnection connection = new MySqlConnection(connectionString);
            try
            {
                connection.Open();
                string query = "UPDATE migration_request SET request_name = @request_name, source_url = @source_url, destination_url = @destination_url WHERE ID = @id";

                using MySqlCommand command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@id", request.ID);
                command.Parameters.AddWithValue("@request_name", request.RequestName);
                command.Parameters.AddWithValue("@source_url", request.SourceURL);
                command.Parameters.AddWithValue("@destination_url", request.DestinationURL);

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

        [HttpDelete("deleteRequest")]
        public bool deleteRequest(int id)
        {
            using MySqlConnection connection = new MySqlConnection(connectionString);
            try
            {
                connection.Open();
                string query = "DELETE FROM migration_request WHERE ID = @id";
                using MySqlCommand command = new MySqlCommand(query, connection);
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
