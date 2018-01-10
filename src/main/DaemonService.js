import assert from 'assert';
import Jayson from 'jayson';

export default class DaemonService {}

// // When a quit is attempted, this is called. It attempts to shutdown the daemon,
// // then calls quitNow() to quit for real.
// function quitDaemon(evenIfNotStartedByApp = false) {
//   function doShutdown() {
//     console.log('Shutting down daemon');
//     daemonStopRequested = true;
//     client.request('daemon_stop', [], err => {
//       if (err) {
//         console.log(`received error when stopping lbrynet-daemon. Error message: ${err.message}\n`);
//         console.log('You will need to manually kill the daemon.');
//       } else {
//         console.log('Successfully stopped daemon via RPC call.');
//         app.quit();
//       }
//     });
//   }
//
//   if (daemon) {
//     doShutdown();
//   } else if (!evenIfNotStartedByApp) {
//     console.log('Not killing lbrynet-daemon because app did not start it');
//     app.quit();
//   } else {
//     doShutdown();
//   }
//
//   // Is it safe to start the installer before the daemon finishes running?
//   // If not, we should wait until the daemon is closed before we start the install.
// }
//
// function handleDaemonSubprocessExited() {
//   console.log('The daemon has exited.');
//   daemon = null;
//   if (!daemonStopRequested) {
//     // We didn't request to stop the daemon, so display a
//     // warning and schedule a quit.
//     //
//     // TODO: maybe it would be better to restart the daemon?
//     if (rendererWindow) {
//       console.log('Did not request daemon stop, so quitting in 5 seconds.');
//       rendererWindow.loadURL(`file://${__static}/warning.html`);
//       setTimeout(app.quit, 5000);
//     } else {
//       console.log('Did not request daemon stop, so quitting.');
//       app.quit();
//     }
//   }
// }

// const daemonPath = process.env.LBRY_DAEMON || path.join(__static, 'daemon/lbrynet-daemon');
//
// const client = Jayson.client.http({
//   host: 'localhost',
//   port: 5279,
//   path: '/',
//   timeout: 1000,
// });
//
// function launchDaemon() {
//   assert(!daemon, 'Tried to launch daemon twice');
//
//   console.log('Launching daemon:', daemonPath);
//   daemon = ChildProcess.spawn(daemonPath);
//   // Need to handle the data event instead of attaching to
//   // process.stdout because the latter doesn't work. I believe on
//   // windows it buffers stdout and we don't get any meaningful output
//   daemon.stdout.on('data', buf => {
//     console.log(String(buf).trim());
//   });
//   daemon.stderr.on('data', buf => {
//     console.log(String(buf).trim());
//   });
//   daemon.on('exit', handleDaemonSubprocessExited);
// }
//
// function launchDaemonIfNotRunning() {
//   // Check if the daemon is already running. If we get
//   // an error its because its not running
//   console.log('Checking for lbrynet daemon');
//   client.request('status', [], err => {
//     if (err) {
//       console.log('lbrynet daemon needs to be launched');
//       launchDaemon();
//     } else {
//       console.log('lbrynet daemon is already running');
//     }
//   });
// }
