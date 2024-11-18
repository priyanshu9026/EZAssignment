const File = require('../models/File');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

// File upload
exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileId = crypto.randomBytes(16).toString('hex');

        const newFile = new File({
            fileId,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            path: req.file.path,
            size: req.file.size,
        });
        await newFile.save();

        res.status(201).json({ message: 'File uploaded successfully', fileId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong during file upload' });
    }
};

// List uploaded files
exports.listFiles = async (req, res) => {
    try {
        const files = await File.find().select('-__v');
        res.status(200).json(files);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong while listing files' });
    }
};

// Download file
exports.downloadFile = async (req, res) => {
    const { fileId } = req.params;

    try {
        const file = await File.findOne({ fileId });
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        res.download(file.path, file.originalName, (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: 'Error while downloading the file' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong during file download' });
    }
};
