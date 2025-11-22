import TinyLink from "../models/tinylink.models.js";
import { generateUniqueCode } from "../utils/generateUniqueCode.js";
class TinyLinkController {

     
    async GetAllLinks(req, res) {
        try {
            console.log("Fetching all links");
            const links = await TinyLink.find({});
            return res.status(200).send({ links });

        } catch (error) {
            console.error("Error fetching links:", error);
            return res.status(500).send({ "error": "Internal Server Error" });
        }
    }

   async  AddNewLink(req, res) {

        try {
            const { TargetURL,customCode=null } = req.body;
            // console.log(req.body,"body");
             if (!TargetURL) {
                return res.status(400).send({ "error": "originalUrl is required" });
            }

            if(customCode){
                const existingLink = TinyLink.findOne({ ShortCode: customCode });
                if(existingLink){
                    return res.status(409).send({ "error": "Custom code already in use" });
                }
                const newUrl=await TinyLink.create({ TargetURL, ShortCode: customCode });
                return res.status(201).send({ "message": "Link created successfully",newUrl });
            }
            else{

                const ShortCode= await generateUniqueCode();
               const newUrl=await TinyLink.create({ TargetURL, ShortCode});
                return res.status(201).send({ "message": "Link created successfully",newUrl }); 
            }

        } catch (error) {
            console.log(error,"during link add");
            return res.status(500).send({ "error": "Internal Server Error" });
        }

    }

  async  DeleteLink(req, res) {

        try{

            const { code } = req.params;
            if(!code){
            return res.status(400).send({ "error": "Short code is required" });
            }
          
         const isDel=await TinyLink.deleteOne({ ShortCode: code });
            if(isDel.deletedCount===0){
                return res.status(404).send({ "error": "Link not found" });
            }

        return res.status(200).send({ "message": "Link deleted successfully" });
        }catch(error){
            return res.status(500).send({ "error": "Internal Server Error" });
        }

    }

   async  RedirectLink(req, res) {

         try{
            const { code } = req.params;
           console.log(code)
            const link = await TinyLink.findOne({ ShortCode: code });
            link.TotalClicks += 1;
          
            if(!link){
                return res.status(404).send({ "error": "Link not found" });
            }
            await link.save();

        return res.status(302).json({url:link.TargetURL});
         }catch(error){
            console.error("Error during redirection:", error);
            return res.status(500).send({ "error": "Internal Server Error" });
         }
    }

}

export default new TinyLinkController();