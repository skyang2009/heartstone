
const { app, BrowserWindow } = require('electron')
let exec = require('child_process').execSync; 

let sleep = async time => new Promise((resolve) => {
  setTimeout(resolve, time);
});

async function sendNotification(title, content){
  let str = 'osascript -e \'display notification "' + content + '" with title "'+ title +'"\' ';
  await command(str);
  await sleep(1000);
}

async function command(cmdStr){
  try{
    await exec(cmdStr, function(err,stdout,stderr){
      if(err) {
          console.log('some error:'+stderr);
      } else {
          // console.log(stdout);
      }
    });
  }
  catch(e){
    console.log(e);
  }
}

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('src/index.html')
}


const { globalShortcut } = require('electron')


app.whenReady().then( async () => {
  // await command("");

  await command('sudo pfctl -ef /etc/pf.conf');

  await command('echo "block in on en0 all" > ./pf_block_all.conf');

  globalShortcut.register('Alt+CommandOrControl+I', () => {
    console.log('Electron loves global shortcuts!')
  })

  globalShortcut.register('F1', async () => {
    console.log('F1收到')
    sendNotification('整活启动', '');
    // await command('sudo ifconfig en0 down');
    await command('sudo pfctl -f  ./pf_block_all.conf');
    await sleep(7*1000);
    await command('sudo pfctl -f /etc/pf.conf');
    sendNotification('整活完毕', '');
  })

  globalShortcut.register('F2', async () => {
    console.log('F2收到')
    sendNotification('联网成功', '');
    await command('sudo pfctl -f /etc/pf.conf') 
    // await command('sudo ifconfig en0 up');
  })

  globalShortcut.register('F3', async () => {
    console.log('F3收到')
    sendNotification('断网启动', '');
    await command('sudo pfctl -f  ./pf_block_all.conf');
  })
}).then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


console.log('=======呼风唤雨✨荣誉出品=====')
console.log('炉石整活工具，F1启动整活，F2关闭整活');
console.log('1、通过pfctl配置防火墙实现一键断网，一键重连');
console.log('2、需要sudo权限');

// electron文档
// https://www.electronjs.org/docs/tutorial/quick-start

// pfctl文档
// http://blog.chinaunix.net/uid-20674714-id-90862.html
