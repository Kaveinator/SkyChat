var App = {
    Start: () => {
      App.RenderServers();
    },
    UI: {
      nav: document.getElementsByTagName("nav")[0],
      header: {
        serverNameElem: document.getElementById("headerServerName"),
        serverCatergories: document.getElementById("headerBrowseServer"),
        serverCatergoryTemplate: "<div class=\"catergory\" id=\"catergory_{id}\"><span class=\"title\" onClick=\"this.parentNode.classList.toggle('hide');\">{name}<span class=\"channelUnreadCount\">{count}</span></span>{channels}</div>",
        serverChannelTemplate: "<div id=\"channel_{id}\" class=\"channel {active}\" onClick=\"App.RenderMessages({id});\">{name}</div>"
      },
      content: {
        chatHeader: document.querySelector(".channelName"),
        memberCount: document.querySelector(".memberCount"),
        chatWindow: {
          elem: document.querySelector(".channelChats"),
          updateScroll: true,
          updateScrollFunc: () => {
            if (!App.UI.content.chatWindow.updateScroll) return;
  
            var elem = App.UI.content.chatWindow.elem;
            elem.scrollTop = elem.scrollHeight - elem.clientHeight;
          },
          onScroll: () => {
            var elem = App.UI.content.chatWindow.elem;
            App.UI.content.chatWindow.updateScroll = elem.scrollHeight - elem.clientHeight <= elem.scrollTop - 5;
            console.log("updateScroll? " + App.UI.content.chatWindow.updateScroll);
          }
        }
      },
      aside: {
        membersList: document.getElementById("membersList")
      }
    },
    ServerTree: [
      {
        Name: "SkyChat",
        Id: 423423,
        Icon: "./serverIcon.jpg",
        Catergories: [
          {
            Name: "Text Channels",
            Id: 417217,
            Channels: [
              {
                Name: "general",
                Id: 465279,
                Messages: [
                  {
                    User: "Kaveman",
                    Id: 143248,
                    Content: "Hi"
                  }
                ]
              },
              {
                Name: "discussion",
                Id: 913547,
                Messages: [
                  {
                    User: "Kaveman",
                    Id: 143248,
                    Content: "Lemme get my debate papers..."
                  }
                ]
              },
              {
                Name: "skynet",
                Id: 732867,
                Messages: [
                  {
                    User: "Kaveman",
                    Id: 143248,
                    Content: "Stonks"
                  }
                ]
              },
              {
                Name: "development",
                Id: 273754,
                Messages: [
                  {
                    User: "Kaveman",
                    Id: 143248,
                    Content: "I got a error today..."
                  },
                  {
                    User: "Kaveman",
                    Id: 123456,
                    Content: "I hope its considered as progress"
                  }
                ]
              },
              {
                Name: "help",
                Id: 357278,
                Messages: [
                  {
                    User: "Kaveman",
                    Id: 143248,
                    Content: "Bro, I don't need help ._."
                  },
                  {
                    User: "Kaveman",
                    Id: 143249,
                    Content: "Actually maybe I do"
                  }
                ]
              }
            ]
          },
          {
            Name: "Other channels",
            Id: 417518,
            Channels: [
              {
                Name: "off-topic",
                Id: 123456,
                Messages: [
                  {
                    User: "Kaveman",
                    Id: 143248,
                    Content: "I shot a person today... in laser tag"
                  }
                ]
              }
            ]
          }
        ],
        Members: [
          "Kaveman",
          "doggie"
        ]
      },
      {
        Name: "Test",
        Id: 123456,
        Icon: "",
        Catergories: [
          {
            Name: "Test Catergory",
            Id: 123456,
            Channels: [
              {
                Name: "test-channel",
                Id: 123456,
                Messages: [
                  {
                    User: "Kaveman",
                    Id: 143243,
                    Content: "Hello world!"
                  },
                  {
                    User: "Kaveman",
                    Id: 143243,
                    Content: "Doggie this works!"
                  },
                  {
                    User: "Kaveman",
                    Id: 143249,
                    Content: "Problem is, these messages are hardcoded with JSON and we need a server to do some processing... and I need to build the message \"onReceive\" function, so I can sort messages into its correct channel XD (and add it to the screen if it is the selected channel)"
                  }
                ]
              },
            ]
          }
        ],
        Members: [
          "Kaveman",
          "doggie",
          "test"
        ]
      }
    ],
    RenderServers: () => {
      var finalHtml = "";
      App.ServerTree.forEach((server, id) => {
        var serverIcon = server.Icon;
        var serverInitials = "";
        if (!serverIcon)
          server.Name.split(' ').forEach(e => serverInitials += e[0]);
        finalHtml += App.ServerIconTemplate.replace("{initials}", serverInitials.toUpperCase()).replace("{icon}", serverIcon).replaceAll("{id}", server.Id);
      });
      document.getElementById("serverElemList").innerHTML = finalHtml;
    },
    ServerIconTemplate: 
      "<a href=\"javascript:App.RenderChannels({id});\" id=\"server_{id}\">" +
        "{initials}" +
        "<div style=\"background-image: url('{icon}');\"></div>" +
      "</a>",
    RenderChannels: async serverId => {
      var serverElement = document.getElementById("server_" + serverId);
      if (serverElement.classList.contains("active"))
        return;
      var otherServer = App.UI.nav.getElementsByClassName("active")[0];
      if (otherServer && serverElement.id != otherServer.id)
        otherServer.classList.remove("active");
      serverElement.classList.add("active");
      try {
        var serverData = await App.FindServerWithId(serverId);
        
        App.UI.header.serverNameElem.innerText = serverData.Name;
        App.currentSet.serverData = serverData;
  
        var browseHtml = "";
        serverData.Catergories.forEach((catergory, catergoryIndex) => {
          var channelsHtml = "";
          catergory.Channels.forEach((channel, channelIndex) => {
            channelsHtml += App.UI.header.serverChannelTemplate
              .replaceAll("{id}", channel.Id)
              .replace("{active}", catergoryIndex == 0 && channelIndex == 0 ? "active" : "")
              .replace("{name}", channel.Name);
          });
          browseHtml += App.UI.header.serverCatergoryTemplate
            .replaceAll("{id}", catergory.Id)
            .replace("{name}", catergory.Name)
            .replace("{count}", catergory.Channels.length)
            .replace("{channels}", channelsHtml);
        });
        App.UI.header.serverCatergories.innerHTML = browseHtml;
        App.UI.header.serverCatergories.querySelector(".channel").onclick.call();
        
        var membersHtml = "";
        serverData.Members.forEach(member => {
          membersHtml += "<div class=\"entry\">{user}</div>"
            .replace("{user}", member);
        });
        App.UI.content.memberCount.innerText = serverData.Members.length;
  
        App.UI.aside.membersList.innerHTML = membersHtml;
      }
      catch {
        alert("Runtime Error: Server not found!");
      }
    },
    RenderMessages: async channelId => {
      // Get currently active channel
      var currentChannelElem = App.UI.header.serverCatergories.querySelector(".channel.active");
      if (App.currentSet.channelData.Id == channelId)
        return;
      
      var newChannelElem = App.UI.header.serverCatergories.querySelector("#channel_" + channelId);
      currentChannelElem.classList.remove("active");
      newChannelElem.classList.add("active");
  
      App.currentSet.channelData = await App.FindChannelWithId(App.currentSet.serverData, channelId);
  
      App.UI.content.chatHeader.innerText = App.currentSet.channelData.Name;
  
      // Set the messages
      var msgTemplate = 
        "<div id=\"msg_{id}\" class=\"chatEntry\">" +
          "<span>{user}</span>" +
          "<div>{msg}</div>" +
        "</div>";
      var finalHtml = "";
      App.currentSet.channelData.Messages.forEach(msg => {
        finalHtml += msgTemplate
          .replaceAll("{id}", msg.Id)
          .replace("{user}", msg.User)
          .replace("{msg}", msg.Content);
      });
      App.UI.content.chatWindow.elem.innerHTML = finalHtml;
  
    },
    createUid: () => {
      var date = new Date();
      return parseInt("" + date.getYear() + date.getMonth() + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds());
    },
    FindServerWithId: serverId => new Promise((resolve, reject) => {
      App.ServerTree.forEach((server, id) => {
        if (server.Id == serverId)
          resolve(server);
        else if (++id == App.ServerTree.length)
          reject("Server not found!");
      });
    }),
    FindChannelWithId: (serverData, channelId) => new Promise((resolve, reject) => {
      serverData.Catergories.forEach((catergory, catergoryIndex) => {
        catergory.Channels.forEach((channel, channelIndex) => {
          if (channel.Id == channelId)
            resolve(channel);
          else if (++catergoryIndex == serverData.Catergories.length && ++channelIndex == catergory.Channels.length)
            reject("Channel not found");
        });
      });
    }),
    sleep: ms => new Promise(resolve => setTimeout(resolve, ms)),
    currentSet: {
      serverData: {},
      channelData: {}
    },
    onMessageReceive: async (serverId, channelId, contentId, username, message, attachment) => {
      try {
        console.log("started");
        var serverData = await App.FindServerWithId(serverId);
        console.log("Found server: \n" + JSON.stringify(serverData, null, 2));
        var channelData = await App.FindChannelWithId(serverData, channelId);
        console.log("Found channel: \n" + JSON.stringify(channelData, null, 2));
        channelData.Messages.push({
          User: username,
          Id: contentId,
          Content: message,
          Attachment: attachment
        });
  
        // get current position of scroll, if it on bottom scroll down to make sure 
        // Add the message if it already exists
        if (App.currentSet.serverData.Id == serverId &&
            App.currentSet.channelData.Id == channelId)
            App.UI.content.chatWindow.elem.innerHTML += 
            ("<div id=\"msg_{id}\" class=\"chatEntry\">" +
              "<span>{user}</span>" +
              "<div>{msg}</div>" +
            "</div>"
            .replaceAll("{id}", contentId)
            .replace("{user}", username)
            .replace("{msg}", message));
      }
      catch (err) {
        console.log(err);
      }
    },
    InvokeSend: form => {
      var msgObject = form.msg;
      var attachmentObject = form.attachment;
      var attachment = form.attachment.files[0];
      if (!msgObject.value && !attachment)
        return;
      
      msgText = string.ToBase64(msgText);
      if (attachment) {
        var fileReader = new FileReader();
        fileReader.readAsText(attachment, "UTF-8");
        fileReader.onload = event => {
          var finalMsg = string.ToBase64(msgObject.value.trim());
          var fileContents = string.ToBase64(event.target.result);
          
          //App.network.SendMessageRequest(
          //  App.currentSet.serverData.Id,  // serverId
          //  App.currentSet.channelData.Id, // channelId
          //  finalMsg,                      // message
          //  fileContents                   // attachment (none)
          //);
        };
        fileReader.onerror = event => {
          alert("File read error!");
        };
      }
      else {
        var finalMsg = string.ToBase64(msgObject.value.trim());
        // App.network.SendMessageRequest(
        //  App.currentSet.serverData.Id,  // serverId
        //  App.currentSet.channelData.Id, // channelId
        //  finalMsg,                      // message
        //  string.Empty                   // attachment (none)
        //);
      }
  
    },
    network: {
      // doggie, your up
    }
  };
  
  const string = {
    ToBase64: string => btoa(string),
    FromBase64: base64String => atob(base64String),
    Empty: ""
  }
  
  console.log("Yeah... DevTools (aka inspect element) is where it all starts. Long ago, when it was still called hacking, and you you enthusiastic to show your friends that you \"hacked\" a site and made it show something else. But in the present day, that is not the case now is it. Instead you found and felt the power of development and now, you can make stuff. Don't give up and have fun in the matrix :D");