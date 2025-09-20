const path =require('path')

const express=require('express')
const alumniRouter=express.Router()

const alumniController=require("../Controllers/alumniController")

const postJobController = require("../controllers/postJobController");

alumniRouter.post("/:userId/post-job", postJobController.postJob);

alumniRouter.get("/:userId/post-job", postJobController.getPostedJobs);

alumniRouter.put("/:userId/post-job/:jobId", postJobController.updatePostedJob);

alumniRouter.delete("/:userId/post-job/:jobId", postJobController.deletePostedJob);

module.exports = alumniRouter;
