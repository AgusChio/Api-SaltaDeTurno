import farmaciaDTO from '../DTO/farmaciaDTO.js';
import farmacia from '../models/farmaciaModel.js';
import farmaciaService from '../services/farmaciaService.js';

const farmaciaController = {
    async getFarmacias(req, res) {
        try {
            const farmacias = await farmaciaService.getAllFarmacias()
            const response = {}
            const farmaciasResponse = farmacias.map(farmaciaDTO)
            response.farmacias = farmaciasResponse
            response.count = farmaciasResponse.length
            res.status(200).json(response)
        } catch (error) {
            res.status(500).json({ error: error })
        }
    },

    async getFarmaciaById(req, res) {
        try {
            const farmacia = await farmaciaService.getById(req.params.id)
            res.status(200).json(farmacia)
        } catch (error) {
            res.status(500).json({ error: error })
        }
    },

    async createFarmacia(req, res) {
        try {
            const farmaciaData = farmacia.newFarmacia(req.body)
            const newFarmacia = await farmaciaService.createFarmacia(farmaciaData)
            res.status(201).json({ success: true, new_farmacia: newFarmacia })
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' })
        }
    },

    async updateFarmacia(req, res) {
        try {
            const { id } = req.params;
            const farmaciaData = req.body;
            const updatedFarmacia = await farmaciaService.updateFarmacia(id, farmaciaData);
            res.status(200).json({ success: true, updated_farmacia: updatedFarmacia });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    deleteFarmacia(req, res) {
        try {
            const deletedFarmacia = farmaciaService.deleteFarmacia(req.params.id)
            res.status(200).json({ success: true, deleted_farmacia: deletedFarmacia })
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' })
        }
    }
}

export default farmaciaController;