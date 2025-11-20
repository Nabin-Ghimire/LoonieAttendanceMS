class OfficeController {
  constructor(officeService, logger) {
    this.logger = logger;
    this.officeService = officeService;
  }

  async punchOffice(req, res, next) {

    const { name, lat, lng } = req.body;


    const payload = {
      name: name,
      location: {
        type: "Point",
        coordinates: [lng, lat]
      },
      radius: 50
    };


    const office = await this.officeService.punch(payload);

    return res.status(201).json({ message: "Clock-in successful", office });
  }


  async removeOffice(req, res, next) {
    const officeId = req.params.id;
    const office = await this.officeService.remove(officeId);
    res.json({ id: office, message: "Office deleted successfully" })
  }

  async getAll(req, res, next) {

    const offices = await this.officeService.getAllOffices();
    res.json(offices)
  }
}



export default OfficeController;