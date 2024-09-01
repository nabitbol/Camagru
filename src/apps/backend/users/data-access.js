const UserDataAccess = (queryBuilder) => {
  const table = "user_entity";
  const all = ["*"];
  const addUser = async (userData) => {
    const res = await queryBuilder.insert(table, userData).run();
    return res;
  };

  const getAllUsers = async () => {
    const res = await queryBuilder.select(all).from(table).run();
    return res;
  };

  const getUserFromEmail = async (email) => {
    const res = await queryBuilder
      .select(["email"])
      .from(table)
      .where(email)
      .run();
    return res.rows[0];
  };

  const getUserFromToken = async (token) => {
    const res = await queryBuilder.select(all).from(table).where(token).run();
    return res.rows[0];
  };

  const updateUser = async (userData, toUpdate) => {
    const res = await queryBuilder
      .update(table, toUpdate)
      .where({ id: userData.id })
      .run();
    return res;
  };

  return {
    addUser,
    updateUser,
    getAllUsers,
    getUserFromEmail,
    getUserFromToken,
  };
};

export { UserDataAccess };
