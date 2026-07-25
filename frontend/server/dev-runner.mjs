import { spawn } from 'child_process';

function run(cmd, args, name) {
  const command = `${cmd} ${args.join(' ')}`;
  const proc = spawn(command, { stdio: 'inherit', shell: true });

  proc.on('exit', (code, signal) => {
    console.log(`${name} exited with ${signal ?? code}`);
    process.exit(code ?? 0);
  });

  proc.on('error', (err) => {
    console.error(`${name} error:`, err);
    process.exit(1);
  });

  return proc;
}

// Start mock server and Vite dev server
const mock = run('npm', ['run', 'mock:server'], 'mock:server');
const vite = run('npm', ['run', 'dev:vite'], 'vite');

// Forward SIGINT/SIGTERM to children
['SIGINT', 'SIGTERM'].forEach(sig => {
  process.on(sig, () => {
    mock.kill(sig);
    vite.kill(sig);
    process.exit();
  });
});
