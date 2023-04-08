using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MySql.Data.MySqlClient;
using BDTB_SPMigration.Models;
using PnP.Framework;
using System.Security;
using System.Collections.Generic;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    // Database connection string
    private readonly string connectionString = "server=localhost;port=3306;user=root;database=bdtb_spmigration";

    [HttpGet("login")]
    public bool LoginUser(string userName, string password)
    {
        using MySqlConnection connection = new MySqlConnection(connectionString);
        try
        {
            connection.Open();
            string query = "SELECT * FROM user WHERE username=@username AND password=@password";

            MySqlCommand command = new MySqlCommand(query, connection);
            command.Parameters.AddWithValue("@username", userName);
            command.Parameters.AddWithValue("@password", password);

            MySqlDataReader reader = command.ExecuteReader();

            if (reader.HasRows)
            {
                User user = new User();
                reader.Read();
                user.ID = reader.GetInt32(0);
                user.UserName = reader.GetString(1);
                user.Password = reader.GetString(2);
                user.Email = reader.GetString(3);
                reader.Close();
                return true;
            }
            else
            {
                reader.Close();
                return false;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return false;
        }
    }


    [HttpPost("register")]
    public bool RegisterUser(string userName, string password, string email)
    {
        using MySqlConnection connection = new MySqlConnection(connectionString);
        try
        {
            connection.Open();
            string query = "INSERT INTO user (username, password, email) VALUES (@username, @password, @email)";

            MySqlCommand command = new MySqlCommand(query, connection);
            command.Parameters.AddWithValue("@username", userName);
            command.Parameters.AddWithValue("@password", password);
            command.Parameters.AddWithValue("@email", email);

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

    [HttpGet("viewuser")]
    public User ViewUser(int id)
    {
        using MySqlConnection connection = new MySqlConnection(connectionString);
        try
        {
            connection.Open();
            string query = "SELECT * FROM user WHERE id=@id";

            MySqlCommand command = new MySqlCommand(query, connection);
            command.Parameters.AddWithValue("@id", id);
            MySqlDataReader reader = command.ExecuteReader();

            if (reader.HasRows)
            {
                User user = new User();
                reader.Read();
                user.ID = reader.GetInt32(0);
                user.UserName = reader.GetString(1);
                user.Password = reader.GetString(2);
                user.Email = reader.GetString(3);
                reader.Close();
                return user;
            }
            return null;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return null;
        }
    }

    [HttpGet("allUsers")]
    public List<User> GetAllUsers()
    {
        List<User> users = new List<User>();
        using MySqlConnection connection = new MySqlConnection(connectionString);
        connection.Open();
        string query = "SELECT ID, UserName, Email FROM user";
        using MySqlCommand command = new MySqlCommand(query, connection);
        using MySqlDataReader reader = command.ExecuteReader();
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
}
