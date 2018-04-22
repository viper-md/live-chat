# live-chat
## swagger_docs : 
```
    web_url : http://54.234.227.245/swagger
```
## mqtt-client : (any web or app with the below credentials will work)
   ```
    web_url : http://www.hivemq.com/demos/websocket-client/
    host : broker.mqttdashboard.com
    port: 8000
    client_id : clientId-LARcggFW96
```
## usage:
``` 
1.Chat group is created with groupName and participants.
2.Participants can now see the group in their chat list view.
3.Participants are now subscribed to all the topics(i.e groupName) in chat list.
4.Whenever someone sends a message in the group the message is published to the groupName.
```
# Tech Stack :
```
node,express,mqtt,async,mongoose,aws,nginx,swagger
```