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
  async getAllOffices(id) {
    return await this.OfficeModel.find();
  }
}

export default AttendanceService;