-- HOW TO RUN THE PROJECT --

    1. Add run permissions to run_project.sh with 'chmod +x run_project.sh' command
    2. you should open the file with an editor to change on the line:
        - mysql -u $your_username -p $your_password < ../bd_app_script.sql
        a. You must change the variables $your_username & $your_password to your respective mysql username and password
        b. If you have not configured a mysql user, you should change this command to:
            - mysql -u root < ../bd_app_script.sql
    3. In command
        - echo "Project is running. Open your browser and visit http://localhost:5500"
        a. By default port 5500 is set but it can be changed at your convenience
    4. Finally you can run de file with:
        - ./run_project.sh


Tools:

    - npm @9.6.7
    - node v18.17.1
    - express ^4.18.2
    - cors ^2.8.5
    - MySql v8.1.0
    - mysql2 v3.7.0
    - Nodemon v3.0.2
    - live-server v1.2.2
