# Task-Tracker-RestAPI Documentation 

Server-URL:

        https://dgamer-task-tracker-api.herokuapp.com

<br>
<br>

#### Signup

This will Create a User Account

method: ```POST```

> ```https://dgamer-task-tracker-rest-api.herokuapp.com/signup```

<br>

**request**

*body*

```javascript
    {
        userSchema
    }
```

<br>

**response**

StatusCode: ```201```

```javascript
    {
        userSchema,
        token
    }
```

**or**

StatusCode: ```400```

```javascript
    {
        error: 'Provide Valid Email-Address.'
    }
```

**or**

StatusCode: ```400```

```javascript
    {
        error: 'Provide valid password.'
    }
```

<br>
<br>

#### Login

This will Login into User Account

method: ```POST```

> ```https://dgamer-task-tracker-rest-api.herokuapp.com/login```

<br>

**request**

*body*

```javascript
    {
        email: 'someone000@example.com',
        password: 'thisIsCo0!p@ss'
    }
```
<br>

**response**

StatusCode: ```200```

```javascript
    {
        userSchema,
        token
    }
```

**or**

StatusCode: ```400```

```javascript
    {
        error: 'Email not registered.'
    }
```

**or**

StatusCode: ```400```

```javascript
    {
        error: 'Unable to login.'
    }
```

<br>
<br>

#### Logout

This will Logout from User Account

method: ```POST```

> ```https://dgamer-task-tracker-rest-api.herokuapp.com/logout```

<br>

**request**

*query*

```
all=true/false                  # This will Logout current user from all instances

exceptthis=true/false           # This will Logout current user from all instances except current
```

*headers*

```javascript
    {
        Authorization: `Bearer ${token}`
    }
```

<br>

**response**

StatusCode: ```200```

*body*

```
Logged out of all devices successfully.
```

**or**

StatusCode: ```200```

*body*

```
Successfully Logged out of all devices except this.
```

**or**

StatusCode: ```200```

*body*

```
Logged out successfully.
```

**or**

StatusCode: ```401```

*body*

```javascript
    {
        error: 'Please Authenticate.'
    }
```

**or**

StatusCode: ```500```

```
Server Error.
```

<br>
<br>

#### Read User Account

This will Read User Account Data

method: ```GET```

> ```https://dgamer-task-tracker-rest-api.herokuapp.com/me```

<br>

**request**

*headers*

```javascript
    {
        Authorization: `Bearer ${token}`
    }
```

<br>

**response**

StatusCode: ```200```

*body*

```javascript
    {
        userSchema
    }
```

**or**

StatusCode: ```401```

*body*

```javascript
    {
        error: 'Please Authenticate.'
    }
```

<br>
<br>

#### Update User Account

This will Update User Account or Change User Account Details

method: ```PATCH```

> ```https://dgamer-task-tracker-rest-api.herokuapp.com/me```

<br>

**request**

*headers*

```javascript
    {
        Authorization: `Bearer ${token}`
    }
```

*body*

```javascript
    {
        name: 'Another Name'
        email: 'somethingelse@nothing.com'
    }                                    
```

**or**

```javascript
    {
        password: 'blahblahB!@H'
    }                                    
```
**or**

```javascript
    {
        name: 'Any Name'
    }                                    
```

<br>

**response**

StatusCode: ```200```

*body*

```javascript
    {
        userSchema
    }
```

**or**

StatusCode: ```400```

*body*

```javascript
    {
        error: 'Invalid Operation.'
    }
```

**or**

StatusCode: ```400```

*body*

```javascript
    {
        error: 'Provide valid Email-Address.'
    }
```

**or**

StatusCode: ```400```

*body*

```javascript
    {
        error: 'Provide valid password.'
    }
```

**or**

StatusCode: ```401```

*body*

```javascript
    {
        error:'Please Authenticate.'
    }
```

<br>
<br>

#### Delete User Account

This will Delete User Account

method: ```DELETE```

> ```https://dgamer-task-tracker-rest-api.herokuapp.com/me```

<br>

**request**

*headers*

```javascript
    {
        Authorization: `Bearer ${token}`
    }
```

<br>

**response**

StatusCode: ```200```

*body*

```javascript
    {   
        userSchema
    }
```
**or**

StatusCode: ```401```

*body*

```javascript
    {
        error: 'Please Authenticate.'
    }
```

**or**

StatusCode: ```500```

``` 
Server Error 
```

<br>
<br>

#### Create Task

This will Create Task for Current User

method: ```POST```

> ```https://dgamer-task-tracker-rest-api.herokuapp.com/me/task```

<br>

**request**

*headers*

```javascript
    {
        Authorization: `Bearer ${token}`
    }
```

*body*

```javascript
    {
        taskSchema
    }
```

<br>

**response**

StatusCode: ```200```

*body*

```javascript
    {
        taskSchema
    }
```

**or**

StatusCode: ```400```

```
Bad Request.
```

**or**

StatusCode: ```401```

*body*

```javascript
    {
        Authorization: 'Please Authenticate.'
    }
```

<br>
<br>

#### Read Tasks

This will read all tasks of Current User

method: ```GET```

> ```https://dgamer-task-tracker-rest-api.herokuapp.com/me/tasks```

<br>

**request**

*query*

```
completed=true/false                # This will filter response data for completed or not completed Tasks

sortBy={taskSchema Key}:decs/asc    # This will sort response data

limit={Number}                      # This will limit response data for given {Number} of Tasks

skip={Number}                       # This will skip first {Number} of Tasks in response data
```

*headers*

```javascript
    {
        Authorization: `Bearer ${token}`
    }
```

<br>

**response**

StatusCode: ```200```

*body*

```javascript
    [
        {
            taskSchema
        },
        ...
    ]
```

**or**

StatusCode: ```401```

*body*

```javascript
    {
        error: 'Please Authenticate.'
    }
```

**or**

StatusCode: ```500```

```
Server Error.
```

<br>
<br>

#### Read Task

This will Read indivudual Task of Current User

method: ```GET```

> ```https://dgamer-task-tracker-rest-api.herokuapp.com/me/tasks/:id```

<br>

**request**

*params*

```
Task_id
```

*headers*

```javascript
    {
        Authorization: `Bearer ${token}`
    }
```

<br>

**response**

StatusCode: ```200```

*body*

```javascript
    {
        taskSchema
    }
```

**or**

StatusCode: ```401```

*body*

```javascript
    {
        error: 'Please Authenticate.'
    }
```

**or**

StatusCode: ```404```

*body*

```javascript
    {
        error: 'No Data found!'
    }
```

**or**

StatusCode: ```500```

```
Server Error
```

<br>
<br>

#### Update Task

This will Update Task details for Current User.

method: ```PATCH```

> ```https://dgamer-task-tracker-rest-api.herokuapp.com/me/tasks/:id```

<br>

**request**

*params*

```
Task_id
```

*headers*

```javascript
    {
        Authorization: `Bearer ${token}`
    }
```

*body*

```javascript
    {
        taskSchema
    }
```

<br>

**response**

StatusCode: ```200```

*body*

```javascript
    {
        taskSchema
    }
```

**or**

StatusCode: ```400```

*body*

```javascript
    {
        error: 'Invalid Operation.'
    }
```

**or**

StatusCode: ```400```

```
Bad Request.
```

**or**

StatusCode: ```404```

*body*

```javascript
    {
        error: 'No Data found!'
    }
```

<br>
<br>

#### Delete Task

This will Delete task for Current User.

method: ```DELETE```

> ```https://dgamer-task-tracker-rest-api.herokuapp.com/me/tasks/:id```

<br>

**request**

*params*

```
Task_id
```

*headers*

```javascript
    {
        Authorization: `Bearer ${token}`
    }
```

<br>

**response**

StatusCode: ```200```

*body*

```javascript
    {
        taskSchema
    }
```

**or**

StatusCode: ```401```

*body*

```javascript
    {
        error: 'Please Authenticate.'
    }
```

**or**

StatusCode: ```404```

*body*

```javascript
    {
        error: 'No Data found!'
    }
```

**or**

StatusCode: ```500```

```
Server Error.
```

<br>
<br>

**userSchema**

```javascript
{
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minlength: 7
    },
    age:{
        type: Number,
        default: 0
    }
}
```

**taskSchema**

```javascript
{
    description:{
        type: String,
        required: true
    },
    completed:{
        type: Boolean,
        default: false
    }
}
```