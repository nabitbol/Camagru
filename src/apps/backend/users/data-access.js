const UserDataAccess = (queryBuilder) => {
  const table = "user_entity";
  const all = ["*"];
  const addUser = async (userData) => {
    try {
      const res = await queryBuilder.insert(table, userData).run();
      return res;
    } catch (err) {
      throw err;
    }
  };

  const getAllUsers = async () => {
    try {
      const res = await queryBuilder.select(all).from(table).run();
      return res;
    } catch (err) {
      throw err;
    }
  };

  const getUserFromEmail = async (email) => {
    try {
      const res = await queryBuilder.select(all).from(table).where(email).run();
      return res.rows[0];
    } catch (err) {
      throw err;
    }
  };

  const getUserFromVerificationToken = async (token) => {
    try {
      const res = await queryBuilder
        .select(all)
        .from(table)
        .where({ email_verification_token: token })
        .run();
      return res.rows[0];
    } catch (err) {
      throw err;
    }
  };

  const getUserFromResetPasswordToken = async (token) => {
    try {
      const res = await queryBuilder
        .select(all)
        .from(table)
        .where({ pass_reset_token: token })
        .run();
      return res.rows[0];
    } catch (err) {
      throw err;
    }
  };

  const updateUser = async (userData, toUpdate) => {
    try {
      const res = await queryBuilder
        .update(table, toUpdate)
        .where({ id: userData.id })
        .run();
      return res;
    } catch (err) {
      throw err;
    }
  };

  return {
    addUser,
    updateUser,
    getAllUsers,
    getUserFromEmail,
    getUserFromVerificationToken,
    getUserFromResetPasswordToken,
  };
};

export default UserDataAccess;
