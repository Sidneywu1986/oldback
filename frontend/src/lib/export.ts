export function exportCSV<T extends Record<string, any>>(
  data: T[],
  columns: { key: keyof T | string | ((row: T) => any); title: string }[],
  filename: string
) {
  const header = columns.map((c) => `"${c.title}"`).join(',');
  const rows = data.map((row) =>
    columns
      .map((col) => {
        const val = typeof col.key === 'function' ? col.key(row) : row[col.key];
        const str = val != null ? String(val).replace(/"/g, '""') : '';
        return `"${str}"`;
      })
      .join(',')
  );

  const csv = '\uFEFF' + [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportExcel<T extends Record<string, any>>(
  data: T[],
  columns: { key: keyof T | string | ((row: T) => any); title: string }[],
  filename: string
) {
  const header = columns.map((c) => c.title);
  const rows = data.map((row) =>
    columns.map((col) => {
      const val = typeof col.key === 'function' ? col.key(row) : row[col.key];
      return val != null ? String(val) : '';
    })
  );

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
    <head><meta charset="UTF-8"></head>
    <body>
      <table border="1">
        <tr>${header.map((h) => `<th>${h}</th>`).join('')}</tr>
        ${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')}
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\uFEFF' + html], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
