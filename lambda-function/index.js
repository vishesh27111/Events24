const { DynamoDBClient, GetItemCommand,PutItemCommand, UpdateItemCommand , DeleteItemCommand, ScanCommand} = require('@aws-sdk/client-dynamodb');

const db = new DynamoDBClient({ region: "us-east-1" });

const envTableName = process.env.EVENT_TABLE_NAME;

//get-event-api
exports.getEvent = async (event) => {
    const response = { 
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*", 
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST"
        }
    };

    try {
        const eventId = event.queryStringParameters["eventId"]; // Assuming eventId is present in the event body

        const params = {
            TableName: envTableName,
            Key: {
                "eventId": { S: eventId } // Assuming eventId is of type String (S)
            },
        };

        const { Item } = await db.send(new GetItemCommand(params));

        response.body = JSON.stringify({
            message: "Successfully retrieved event.",
            data: (Item) ? parseDynamoDBItem(Item) : {},
        });
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to get event.",
            error: e.message,
        });
    }

    return response;
};

// Helper function to parse DynamoDB Item to a plain JavaScript object
function parseDynamoDBItem(item) {
    const parsedItem = {};
    for (const key of Object.keys(item)) {
        parsedItem[key] = item[key].S || item[key].N || item[key].BOOL || item[key].M || item[key].L || item[key].SS || item[key].NS || item[key].BS || null;
    }
    return parsedItem;
}

//create-event-api
exports.createEvent = async (event) => {
    const response = { 
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*", 
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST"
        }
    };

    try {
        // Parse the JSON data from the request body
        const eventData = event.queryStringParameters;

        // Construct the Item object for DynamoDB
        const item = {};
        for (const key in eventData) {
            // Assuming all attributes are strings (S)
            item[key] = { S: eventData[key] };
        }

        // Set up parameters for PutItemCommand
        const params = {
            TableName: envTableName,
            Item: item,
        };

        // Call DynamoDB to put the item
        await db.send(new PutItemCommand(params));

        // Set success response
        response.body = JSON.stringify({
            message: "Event created successfully.",
        });
    } catch (e) {
        // Handle errors
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to create event.",
            error: e.message

        });
    }
    return response;

}

//update-event-api
exports.updateEvents = async (event) => {
    const response = { 
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*", 
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST"
        }
    };

    try {
        // Parse the JSON data from the request body
        const eventData = event.queryStringParameters;

        console.log("data::"+eventData)

        // Extract the eventId from the eventData
        const eventId = eventData.eventId;

        // Prepare the update expression and attribute values
        let updateExpression = "SET ";
        const expressionAttributeValues = {};
        const expressionAttributeNames = {};

        // Build the update expression and attribute values
        Object.entries(eventData).forEach(([key, value]) => {
            if (key !== 'eventId') {
                updateExpression += `#${key} = :${key}, `;
                expressionAttributeValues[`:${key}`] = { S: value.toString() };
                expressionAttributeNames[`#${key}`] = key;
            }
        });


        // Remove the trailing comma and space from the update expression
        updateExpression = updateExpression.slice(0, -2);

        // Set up parameters for UpdateItemCommand
        const params = {
            TableName: envTableName,
            Key: {
                "eventId": { S: eventId }
            },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ExpressionAttributeNames: expressionAttributeNames

        };

        // Call DynamoDB to update the item
        const { Attributes } = await db.send(new UpdateItemCommand(params));

        // Set success response
        response.body = JSON.stringify({
            message: "Event updated successfully.",
            data: Attributes,
        });
    } catch (e) {
        // Handle errors
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to update event.",
            error: e.message
        });
    }

    return response;
};

//delete-event-api
exports.deleteEvent = async (event) => {
    const response = { 
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*", 
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST"
        }
    };

    try {
        // Parse the JSON data from the request body
        const eventData = event.queryStringParameters;

        // Extract the eventId from the eventData
        const eventId = eventData.eventId;

        // Set up parameters for DeleteItemCommand
        const params = {
            TableName: envTableName,
            Key: {
                "eventId": { S: eventId }
            },
        };

        // Call DynamoDB to delete the item
        await db.send(new DeleteItemCommand(params));

        // Set success response
        response.body = JSON.stringify({
            message: "Event deleted successfully.",
        });
    } catch (e) {
        // Handle errors
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to delete event.",
            error: e.message
        });
    }
    return response;
};

//getAllEvents-api
exports.getAllEvents = async (event) => {
    const response = { 
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*", 
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST"
        }
    };

    try {
        // Set up parameters for ScanCommand
        const params = {
            TableName: envTableName,
        };

        // Call DynamoDB to scan the table and retrieve all items
        const { Items } = await db.send(new ScanCommand(params));

        // Parse the DynamoDB items to plain JavaScript objects
        const events = Items.map(item => parseDynamoDBItem(item));

        // Set success response with the retrieved events
        response.body = JSON.stringify({
            message: "Successfully retrieved all events.",
            data: events,
        });
    } catch (e) {
        // Handle errors
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to retrieve events.",
            error: e.message
        });
    }

    return response;
};

//getEventsByUSerId
exports.getEventsByUSerId = async (event) => {
    const response = { 
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*", 
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST"
        }
    };

    try {
        const userId = event.queryStringParameters["userId"];

        const params = {
            TableName: envTableName,
            FilterExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': { S: userId }
            }
        };

        const Item = await db.send(new ScanCommand(params));
        response.body = JSON.stringify({
            message: "Successfully retrieved users events post.",
            data: (Item) ? parseDynamoDBItem(Item) : {},
        });
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to get events.",
            error: e.message,
        });
    }

    return response;
};


//sign up
exports.createUser = async (event) => {
    const response = {
    statusCode: 200,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST"
    }
    };

    try {
        const eventBody = event.queryStringParameters;

        const existingUser = await getUserByUsername(eventBody.email);
        if (existingUser) {
        response.body = JSON.stringify({ message: 'Email already exists' });
        return response;
        }

        const currentTimeInMilliseconds = Date.now();
        const nanoseconds = process.hrtime.bigint().toString().padStart(9, '0');
        const userId = `${currentTimeInMilliseconds}${nanoseconds}`;

        const user = {
            userId: userId,
            email: eventBody.email,
            password: eventBody.password,
        };
        const item = {};
        for (const key in user) {
            // Assuming all attributes are strings (S)
            item[key] = { S: user[key] };
        }
        const params = {
            TableName: "users",
            Item: item
        };

        await db.send(new PutItemCommand(params));

        response.body = JSON.stringify({
            message: "Successfully signed up."
        });
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to create event.",
            errorMsg: e.message,
            errorStack: e.stack,
        });
    }

    return response;
};
async function getUserByUsername(email) {
    try {
        const params = {
            TableName: "users",
            FilterExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': { S: email }
            }
        };

        const data = await db.send(new ScanCommand(params));
        return data.Items.length > 0 ? parseDynamoDBItem(data.Items[0]) : null;
    } catch (error) {
        console.error("Error fetching user by email:", error);
        throw error;
    }
}

//login
exports.loginUser = async (event) => {

    // const response = { 
    //     statusCode: 200,
    //     headers: {
    //         "Access-Control-Allow-Origin": "*", 
    //         "Access-Control-Allow-Headers": "Content-Type",
    //         "Access-Control-Allow-Methods": "OPTIONS,POST"
    //     }
    // };
    
    // const evenData = event.queryStringParameters; // Assuming the request body is a JSON string\
    // const userId=evenData["userId"]
    // const email=evenData["email"];
    // const password=evenData["password"];
    
    // const params = {
    //     TableName: "users", // Replace with your table name
    //     Key: { "userId": { S: userId } } // 'S' indicates the value is a string
    // };

    // try {
      
    //     const { Item } = await db.send(new GetItemCommand(params));
    
    //     if (!Item) {
    //         return {
    //             statusCode: 404,
    //             body: JSON.stringify({ message: "User not found" }),
    //         };
    //     }

    //     // In a real application, compare the hashed passwords instead
    //     const storedPassword = Item.password.S;
    //     console.log(password+"   ::::"+storedPassword);
    //     if (password === storedPassword) {
    //         return {
    //             statusCode: 200,
    //             body: JSON.stringify({ message: "Login successful" }),
    //         };
    //     } else {
    //         // Authentication failed
    //         return {
    //             statusCode: 401,
    //             body: JSON.stringify({ message: "Invalid username or password" }),
    //         };
    //     }
    // } catch (error) {
    //     console.error("Error during login:", error);
    //     return {
    //         statusCode: 500,
    //         body: JSON.stringify({ message: "An error occurred during login" }),
    //     };
    // }
    const response = {
    statusCode: 200,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "*"
    }
    };

    try {
        const eventBody = event.queryStringParameters;

        const params = {
            TableName: "users",
            FilterExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': { S: eventBody.email }
            }
        };

        const Item = await db.send(new ScanCommand(params));

        console.log({ Item });

        if (Item.Items.length === 0) {
        return {
            statusCode: 404,
            headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "*"
            },
            body: JSON.stringify({ message: 'Email not found' }),
        };
        }
        const user = parseDynamoDBItem(Item.Items[0]);
        if (user.password !== eventBody.password) {
        return {
            statusCode: 401,
            headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "*"
            },
            body: JSON.stringify({ message: 'Invalid password' })
        };
        }

        response.body = JSON.stringify({
            message: "Successfully retrieved user.",
            data: user,
        });
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to get job post.",
            errorMsg: e.message,
            errorStack: e.stack,
        });
    }
    return response;
};

const { SNSClient, SubscribeCommand, PublishCommand } = require("@aws-sdk/client-sns");
const snsClient = new SNSClient({ region: process.env.AWS_REGION });

exports.subscribeToTopic = async (event) => {
    try {
        const email = event.queryStringParameters.email;
        const subscribeParams = {
            Protocol: 'email',
            Endpoint: email,
            TopicArn: process.env.SNS_TOPIC_ARN
        };
        await snsClient.send(new SubscribeCommand(subscribeParams));
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Subscribed to topic successfully' })
        };
    } catch (e) {
        console.error(e);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to subscribe to topic', error: e.message })
        };
    }
};


exports.publishToTopic = async (event) => {
    try {
        const message = event.queryStringParameters.message;
        const subject = event.queryStringParameters.subject;
        const publishParams = {
            TopicArn: process.env.SNS_TOPIC_ARN,
            Message: message,
            Subject: subject
        };
        await snsClient.send(new PublishCommand(publishParams));
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Message published successfully' })
        };
    } catch (e) {
        console.error(e);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to publish message', error: e.message })
        };
    }
};

