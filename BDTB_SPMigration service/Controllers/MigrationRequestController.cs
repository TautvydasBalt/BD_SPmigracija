using BDTB_SPMigration.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;

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
            string query = "SELECT ID, request_name, source_url, destination_url, status FROM migration_request";
            using MySqlCommand command = new MySqlCommand(query, connection);
            using MySqlDataReader reader = command.ExecuteReader();
            while (reader.Read())
            {

                requests.Add(new MigrationRequest
                {
                    ID = reader.GetInt32(0),
                    RequestName = reader.GetString(1),
                    SourceURL = reader.GetString(2),
                    DestinationURL = reader.GetString(3),
                    Status = reader.GetString(4),
                    AssignedUsers = getAssignedUsers(reader.GetInt32(0)),
                });
            }
            return requests;
        }

        private List<User> getAssignedUsers(int id)
        {
            List<User> users = new List<User>();
            using MySqlConnection connection = new MySqlConnection(connectionString);
            connection.Open();
            string query = "SELECT u.id, u.UserName, u.Email FROM assigned_users as au INNER JOIN user as u ON u.id = au.id_user WHERE au.id_request = @id;";

            MySqlCommand command = new MySqlCommand(query, connection);
            command.Parameters.AddWithValue("@id", id);
            MySqlDataReader reader = command.ExecuteReader();
            while (reader.Read())
            {
                users.Add(new User
                {
                    ID = reader.GetInt32(0),
                    UserName = reader.GetString(1),
                    Email = reader.GetString(2),
                });
            }
            return users;
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
                    migrationRequest.Status = reader.GetString(4);
                    migrationRequest.AssignedUsers = getAssignedUsers(reader.GetInt32(0));
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
        public bool createRequest(string RequestName, string SourceURL, string DestinationURL, int[] userIDs)
        {
            using MySqlConnection connection = new MySqlConnection(connectionString);
            try
            {
                connection.Open();
                string query = "INSERT INTO migration_request (request_name, source_url, destination_url, status) VALUES (@request_name, @source_url, @destination_url, @status)";

                MySqlCommand command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@request_name", RequestName);
                command.Parameters.AddWithValue("@source_url", SourceURL);
                command.Parameters.AddWithValue("@destination_url", DestinationURL);
                command.Parameters.AddWithValue("@status", "New");

                int rowsAffected = command.ExecuteNonQuery();

                if (userIDs.Length > 0)
                {
                    int id = (int)command.LastInsertedId;
                    assignUsersToRequest(connection, userIDs, id);
                }
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
        public bool updateRequest(int id,string RequestName, string SourceURL, string DestinationURL, int[] userIDs)
        {
            using MySqlConnection connection = new MySqlConnection(connectionString);
            try
            {
                connection.Open();
                string query = "UPDATE migration_request SET request_name = @request_name, source_url = @source_url, destination_url = @destination_url WHERE ID = @id";

                MySqlCommand command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@id", id);
                command.Parameters.AddWithValue("@request_name", RequestName);
                command.Parameters.AddWithValue("@source_url", SourceURL);
                command.Parameters.AddWithValue("@destination_url", DestinationURL);

                int rowsAffected = command.ExecuteNonQuery();
                if (userIDs.Length == 0) deleteAllRequestUsers(connection, id);
                else if (userIDs.Length > 0)
                {
                    deleteAllRequestUsers(connection, id);
                    assignUsersToRequest(connection, userIDs, id);
                }

                if (rowsAffected > 0) return true;
                else return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }

        [HttpPut("approveRequest")]
        public bool approveRequest(string id)
        {
            using MySqlConnection connection = new MySqlConnection(connectionString);
            try
            {
                connection.Open();
                string query = "UPDATE migration_request SET status = @status WHERE ID = @id";

                using MySqlCommand command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@id", id);
                command.Parameters.AddWithValue("@status", "Approved");
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
                deleteAllRequestUsers(connection, id);

                string query = "DELETE FROM migration_request WHERE ID = @id";
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

        public bool deleteAllRequestUsers(MySqlConnection connection, int id)
        {
            string query = "DELETE FROM assigned_users WHERE ID_request = @id";
            MySqlCommand command = new MySqlCommand(query, connection);
            command.Parameters.AddWithValue("@id", id);
            int rowsAffected = command.ExecuteNonQuery();

            if (rowsAffected > 0) return true;
            else return false;
        }

        public bool assignUsersToRequest(MySqlConnection connection, int[] userIDs, int requestID)
        {
            string values = "";
            for (int i = 0; i <= userIDs.Length - 1; i++)
            {
                values += "(" + userIDs[i] + "," + requestID + ')';
                if (i < userIDs.Length - 1) values += ", ";
            }

            string query = "INSERT INTO `assigned_users` (`ID_user`, `ID_request`) VALUES " + values;
            MySqlCommand command = new MySqlCommand(query, connection);
            int rowsAffected = command.ExecuteNonQuery();

            if (rowsAffected > 0) return true;
            else return false;
        }
    }
}
