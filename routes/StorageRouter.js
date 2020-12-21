const Router = require('express').Router();
const path = require('path');
const multer = require('multer');
const { Worker } = require('worker_threads');

class ImageTemplate {
    constructor(filename){
        const name = path.parse(filename).name;
        const namePiece = name.split('_');
        this.station = namePiece[0];
        this.camera = namePiece[1];
        this.license = namePiece[2];
        this.date = namePiece[3];
        this.time = namePiece[4];
        this.color = namePiece[5];
        this.color?this.type = 'vehicle':this.type = 'plate';
    }

    isCar(){
        return this.type === 'vehicle';
    }

    isPlate(){
        return this.type === 'plate';
    }
}

const rootPath = path.dirname(require.main.filename || process.mainModule.filename);

const storage =  multer.diskStorage({
    destination: (req, file, callback) =>{
        const imageObject = new ImageTemplate(file.originalname);
        callback(null, `${rootPath}/upload/${imageObject.type}`);
    },
    filename: (req, file, callback) =>{
        callback(null, file.originalname);
    }
});

const uploaderGenerator = (storage) =>multer({
    storage: storage
}).array('image');

const thread = vehicles =>{
    return new Promise((resolve, reject) =>{
        const worker = new Worker(`${rootPath}/service/worker.js`, {workerData:vehicles});
        worker.on('message', resolve);
        worker.on('error', reject);
    });
};

const runThread = async vehicles =>  {
    await thread(vehicles);
};

Router.put('/store', (req, res) =>{

    if (req.headers.authorization !== process.env.SERVER_TOKEN)
        return res.status(401).send({success: false, error: "Unauthorized"});

    const uploader = uploaderGenerator(storage);

    uploader(req, res, error =>{
        if(error)
            res.status(400).send({success:false, error:error});
        else{
            let vehicles = [];

            req.files.map(value => {
                let temp = new ImageTemplate(value.originalname);
                if(temp.isPlate())
                    vehicles.push(temp);
            });

            thread(vehicles)
                .then(res =>{console.log(res)})
                .catch(error => console.log(error));
            res.status(200).send({success:true});
        }
    });
});

module.exports = Router;