export async function fetchStats() {
  try {
    const res = await fetch('/api/stats');
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  } catch (e) {
    return {
      ecoles: 0,
      centresSante: 0,
      pointsEau: 0,
      population: '0',
      superficie: '0 km²',
    };
  }
}

export async function fetchHistory() {
  try {
    const res = await fetch('/api/history');
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    return [];
  }
}

export async function fetchExports() {
  try {
    const res = await fetch('/api/exports');
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    return [];
  }
}

export async function requestExport(payload: any) {
  const res = await fetch('/api/exports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Export request failed');
  return res.json();
}
