
exports.setRoutes = async (app) => {
    app.get('/', (req, res) => res.send("Matilah engkau, cau pandan"))

    app.get('/testing/:query', (req, res) => {
        res.json(req.params);
    })

    return app;
}