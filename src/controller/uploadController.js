const uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No se subió ninguna imagen" });
    }

    const folder = req.query.folder || "otros";
    const imageUrl = `/${folder}/${req.file.filename}`;

    res.status(201).json({
        msg: "Imagen subida con éxito",
        url: imageUrl,
        nombreArchivo: req.file.filename,
    });
};

export { uploadImage };
