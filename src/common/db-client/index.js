const requestDb = async (pool, query) => {
  const client = await pool.connect();
  const { text, values } = query;

  try {
    const res = await client.query(text, values);
    return res;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

export { requestDb };
