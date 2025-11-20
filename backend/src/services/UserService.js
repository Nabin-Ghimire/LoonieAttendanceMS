
class UserService {
  constructor(UserModel) { this.UserModel = UserModel }

  createUser = async (userData) => {
    try {
      return await this.UserModel.create(userData);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  findUserByEmail = async (email) => {
    try {
      return await this.UserModel.findOne({ email })
    } catch {
      throw error;
    }
  }

  findUserById = async (id) => {
    try {
      return await this.UserModel.findById(id);
    } catch (error) {
      throw error;
    }
  }

  getAllUsers = async (validatedQuery) => {
    const { q, role, currentPage, perPage } = validatedQuery;

    const search = q ? new RegExp(q, "i") : null;

    const match = {};

    if (q) {
      match.$or = [
        { firstName: search },
        { lastName: search },
        { email: search }
      ];
    }

    if (role) {
      match.role = role;
    }

    const skip = (currentPage - 1) * perPage;

    const pipeline = [
      { $match: match },

      {
        $lookup: {
          from: "users",
          localField: "organizationId",
          foreignField: "_id",
          as: "organization"
        }
      },

      { $unwind: { path: "$organization", preserveNullAndEmptyArrays: true } },


      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: perPage }
    ];

    const data = await this.UserModel.aggregate(pipeline);

    const count = await this.UserModel.countDocuments(match);

    return [data, count];
  }



  getUserById = async (id) => {
    try {
      return await this.UserModel.findById(id);
    } catch (error) {
      throw error;
    }
  }

  updateUser = async ({ data }) => {
    try {
      return await this.UserModel.create(data);
    } catch (error) {
      throw (error);
    }
  }

  updateUser = async (id, { data }) => {
    try {
      return await this.UserModel.findByIdAndUpdate(id, data);
    } catch (error) {
      throw (error);
    }
  }

  removeUser = async (id) => {
    try {
      return await this.UserModel.findByIdAndDelete(id);
    } catch (error) {
      throw (error);
    }
  }
}

export default UserService;