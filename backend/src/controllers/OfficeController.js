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

    res.status(201).json({ message: "Clock-in successful", office });

    this.logger.info('Office created', { id: String(office._id) });
  }

  async removeOffice(req, res, next) {
    const officeId = req.params.id;
    const office = await this.officeService.remove(officeId);
    res.status(200).json({ id: office, message: "Office deleted successfully" })
    this.logger.info('Office deleted', { id: String(officeId) });
  }

  async getAll(req, res, next) {

    const offices = await this.officeService.getAllOffices();
    res.status(200).json(offices)
    this.logger.info('Fetched all offices');
  }

  async getOneOffice(req, res, next) {
    const { id } = req.params;
    const offices = await this.officeService.getSingleOffice(id);
    res.status(200).json(offices)
    this.logger.info('Fetched single office', { id: String(id) });
  }
}



export default OfficeController;