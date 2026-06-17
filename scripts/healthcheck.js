/**
 * 健康检查脚本 - 验证系统各服务是否正常运行
 * Health Check Script - Verify all services are running properly
 */

import http from 'http';

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(color, text, bold = false) {
  const prefix = bold ? colors.bold : '';
  console.log(`${prefix}${colors[color]}${text}${colors.reset}`);
}

function checkHTTP(url, timeout = 5000) {
  return new Promise((resolve) => {
    const req = http.get(url, { timeout }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          success: res.statusCode >= 200 && res.statusCode < 400,
          statusCode: res.statusCode,
          data: data.slice(0, 200),
        });
      });
    });

    req.on('error', () => {
      resolve({ success: false, statusCode: 0, data: '', error: 'Connection refused' });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ success: false, statusCode: 0, data: '', error: 'Timeout' });
    });
  });
}

async function checkPort(port, serviceName) {
  const result = await checkHTTP(`http://localhost:${port}/api/health`);
  if (result.success) {
    log('green', `  ✓ ${serviceName} (端口 ${port}) - 运行正常`, true);
    return true;
  } else {
    log('red', `  ✗ ${serviceName} (端口 ${port}) - 未响应`, true);
    return false;
  }
}

async function checkFrontend(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}`, { timeout: 3000 }, (res) => {
      resolve({
        success: res.statusCode >= 200 && res.statusCode < 400,
        statusCode: res.statusCode,
      });
    });
    req.on('error', () => resolve({ success: false }));
    req.on('timeout', () => { req.destroy(); resolve({ success: false }); });
  });
}

async function main() {
  console.log('');
  log('cyan', '╔══════════════════════════════════════════════════════╗', true);
  log('cyan', '║          智能招聘辅助系统 - 健康检查报告               ║', true);
  log('cyan', '╚══════════════════════════════════════════════════════╝', true);
  console.log('');

  const backendPorts = [3001, 3002, 3003];
  const frontendPorts = [5173, 5174, 5175, 5176, 5177, 5178];

  log('blue', '【后端服务检查】', true);
  let backendOk = false;
  for (const port of backendPorts) {
    const result = await checkPort(port, '后端 API');
    if (result) {
      backendOk = true;
      break;
    }
  }
  if (!backendOk) log('yellow', '    提示: 后端服务可能未启动');
  console.log('');

  log('blue', '【前端服务检查】', true);
  let frontendOk = false;
  for (const port of frontendPorts) {
    const result = await checkFrontend(port);
    if (result.success) {
      log('green', `  ✓ 前端应用 (端口 ${port}) - 运行正常`, true);
      frontendOk = true;
      break;
    }
  }
  if (!frontendOk) {
    log('red', '  ✗ 前端应用 - 未响应 (已检查 5173-5178 端口)', true);
    log('yellow', '    提示: 前端服务可能未启动');
  }
  console.log('');

  log('blue', '【系统状态总结】', true);
  if (backendOk && frontendOk) {
    log('green', '  ✓ 所有服务运行正常！系统可正常使用', true);
  } else if (backendOk || frontendOk) {
    log('yellow', '  ⚠ 部分服务未运行，请检查启动状态', true);
  } else {
    log('red', '  ✗ 系统未运行，请使用启动脚本启动系统', true);
    log('yellow', '    Windows:   scripts\\start.bat');
    log('yellow', '    PowerShell: scripts\\start.ps1');
    log('yellow', '    通用:     npm start');
  }
  console.log('');
}

main().catch(console.error);
