const express = require('express');
const router = express.Router();
const Daftar = require('../models/daftarModel');

var AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: '',
    secretAccessKey: '',
    region: ''
  });
const ses = new AWS.SES();
  

router.get('/', (req, res, next)=>{
    async function findAll(){
        var result = await Daftar.find({});
        res.send({code: 1000, message: 'Tampilan semua pendaftaran', result: result})
    }
    findAll()
})

router.post('/', (req, res, next)=>{

    async function updateData(){
        var resultSearch = await Daftar.findOne({nama: req.body.nama});
        if(resultSearch){
            res.send({code: 2000, message: 'Your Name Is Already Uses'})
        }else{
            const data = new Daftar({ nama: req.body.nama, alamat: req.body.alamat, nomor_telepon: req.body.nomor_telepon, jenis_kelamin: req.body.jenis_kelamin });
                data.save().then((result, err) => {
                    if(result){

                        const params = {
                            Destination: {
                              ToAddresses: [req.body.email]
                            },
                            Message: {
                              Body: {
                                Html: {
                                  Charset: "UTF-8",
                                  Data: `${req.body.nama} berhasil tersimpan`
                                },
                                Text: {
                                  Charset: "UTF-8",
                                  Data: "Maaf, Jika kamu menerima pesan ini berarti terjadi gangguan dalam pengiriman email. Hubungi Niomic ya via email : hello@niomic.com / WA: 085216601682"
                                }
                              },
                              Subject: {
                                Charset: "UTF-8",
                                Data: `${req.body.nama} insert`
                              }
                            },
                            ReturnPath: 'NIOMIC.id <hello@niomic.com>',
                            Source: 'NIOMIC.id <hello@niomic.com>'
                          };
                    
                          ses.sendEmail(params, (err, data) => {
                            console.log(data)
                          });


                          
                        res.send({code: 1000, message: 'Pendaftaran Berhasil Di Simpan', result: result})
                    }else {
                        res.send(err)
                    }
            });
        }
        
    }
    updateData()


    
})

router.put('/', (req, res, next)=>{
    async function updateData(){
        var result = await Daftar.findByIdAndUpdate(req.body.id, {name: req.body.name, description: req.body.description});
        res.send(`${result._id} : Edited`)
    }
    updateData()
})

router.post('/delete', (req, res, next)=>{
    async function deleteData(){
        var result = await Daftar.findByIdAndDelete({_id: req.body.id});
        res.send(result)
    }
    deleteData()

})

module.exports = router;
