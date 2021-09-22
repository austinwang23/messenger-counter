import { readdir } from 'fs/promises';
//SET INBOX FOLDER PATH
const path = './inbox';

//SET MINIMUM NUMBER OF MESSAGES
const minMsgs = 5000;

function checkCall(message) {
  return message.type === 'Call';
}
async function gett() {
  let final = [];
  try {
    const dirs = await readdir(path, {withFileTypes: true});
    for (const dir of dirs) {
      if(dir.isDirectory()){
        let numFiles = 0;
        let numMsgs = 0;
        let seconds = 0;
        let name = "";
        const subpath = `./inbox/${dir.name}`;
        const files = await readdir(subpath, {withFileTypes: true});
        for (const file of files) {  
          if(!file.isDirectory()){
            if(file.name !== ".DS_Store"){
              numFiles++;
              const fullpath = `${subpath}/message_${numFiles}.json`
              const json = await import(fullpath);
              name = json.default.title;
              numMsgs += json.default.messages.length;
              const messages = json.default.messages;
              const calls = messages.filter(checkCall);
              calls.forEach((call) => {
                seconds += call.call_duration;
              });
            }
          }
        }
        if(numMsgs > minMsgs){
          var h = Math.floor(seconds / 3600);
          var m = Math.floor((seconds % 3600) / 60);
          var s = Math.floor((seconds % 3600) % 60);

          var hDisplay = h > 0 ? h + 'h ' : ' ';
          var mDisplay = m > 0 ? m + 'm ' : ' ';
          var sDisplay = s > 0 ? s + 's' : '';
          const callString = hDisplay + mDisplay + sDisplay;
          final.push({ msgs: numMsgs, name: name, totalCall: callString});
        }
      }
    }
    final.sort(function (a, b) {
      return a.msgs - b.msgs;
    });
    console.log(final)
  } catch (err) {
    console.error(err);
  }
}

gett();
