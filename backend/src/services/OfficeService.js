class AttendanceService {
  constructor(OfficeModel) {

    this.OfficeModel = OfficeModel

  }

  async punch(payload) {
    return await this.OfficeModel.create(payload);
  }

  async findOffice() {
    return this.OfficeModel.findOne();
  }

  async remove(id) {
    return await this.OfficeModel.findByIdAndDelete(id);
  }
  async getAllOffices() {
    return await this.OfficeModel.find();
  }

  async getSingleOffice(id) {
    return await this.OfficeModel.findById(id);
  }
}

export default AttendanceService;