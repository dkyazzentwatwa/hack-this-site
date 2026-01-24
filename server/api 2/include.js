const { getQuery, setCommonHeaders, sendText } = require('./_utils');

module.exports = (req, res) => {
  setCommonHeaders(res);
  const query = getQuery(req);
  const page = (query.page || 'home.php').toLowerCase();

  // Multiple bypass techniques students should discover:
  // 1. Standard path traversal: ../
  // 2. URL encoding: %2e%2e%2f or %2e%2e/
  // 3. Double encoding: %252e%252e%252f
  // 4. Directory traversal with extra slashes: ....//, ...//
  // 5. Null byte injection (legacy): ..%00
  // 6. Backslash on Windows: ..\

  const dangerousPatterns = [
    '..',
    '%2e%2e',
    '..%2f',
    '%252e',
    '..../',
    '.../',
    '..;/',
    '..\\'
  ];

  const hasTraversal = dangerousPatterns.some(pattern =>
    page.includes(pattern)
  );

  const targetFiles = ['etc/passwd', 'etc/shadow', 'windows/system32', 'boot.ini', 'win.ini'];
  const accessingSensitiveFile = targetFiles.some(file =>
    page.includes(file)
  );

  if (hasTraversal && accessingSensitiveFile) {
    // Simulated /etc/passwd content
    return sendText(res, 200,
      'root:x:0:0:root:/root:/bin/bash\n' +
      'daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\n' +
      'bin:x:2:2:bin:/bin:/usr/sbin/nologin\n' +
      'sys:x:3:3:sys:/dev:/usr/sbin/nologin\n' +
      'sync:x:4:65534:sync:/bin:/bin/sync\n' +
      'www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\n' +
      'backup:x:34:34:backup:/var/backups:/usr/sbin/nologin\n' +
      'admin:x:1000:1000:Admin User:/home/admin:/bin/bash'
    );
  }

  if (hasTraversal) {
    return sendText(res, 400,
      'Error: Path traversal detected but file not found.\n' +
      'Hint: Try targeting sensitive files like /etc/passwd or Windows system files.'
    );
  }

  return sendText(res, 200, `Included page: ${page}`);
};
