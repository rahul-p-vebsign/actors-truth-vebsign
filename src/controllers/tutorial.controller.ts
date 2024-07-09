import { Request, Response } from "express";
import Tutorial from "../models/tutorial.model";
import tutorialService from "../services/tutorial.service";

export default class TutorialController {
  async create(req: Request, res: Response) {

    if (!req.body.title) {      
      res.status(400).send({message: "Content can not be empty!"});
      return;
    }

    try {
      const tutorial: Tutorial = req.body;
      const savedTutorial = await tutorialService.save(tutorial);   
      res.status(201).send({msg:"Tutorial saved successfully",data:savedTutorial});
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving tutorials."
      });
    }
  }

  async findAll(req: Request, res: Response) {
    const title = typeof req.query.title === "string" ? req.query.title : "";
    console.log("title is : ",title);
    try {
      const tutorials = await tutorialService.retrieveAll({ title: title });
      if(tutorials.length>0){
        res.status(200).send({msg:"All tutorials found successfully",data:tutorials});
      }else{
        res.status(200).send({msg:"Tutorials not found",data:tutorials});
      }
      
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving tutorials."
      });
    }
  }

  async findOne(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const tutorial = await tutorialService.retrieveById(id);

      if (tutorial){
        res.status(200).send({message: `Tutorial found with id=${id}.`,data:tutorial});
      } 
      else{
        res.status(404).send({message: `Cannot find Tutorial with id=${id}.`,data:[]});
      }        

    } catch (err) {
      res.status(500).send({
        message: `Error retrieving Tutorial with id=${id}.`
      });
    }
  }

  async update(req: Request, res: Response) {
    let tutorial: Tutorial = req.body;
    tutorial.id = parseInt(req.params.id);

    try {
      const num = await tutorialService.update(tutorial);

      if (num == 1) {
        res.send({message: "Tutorial was updated successfully."});
      } else {
        res.send({message: `Cannot update Tutorial with id=${tutorial.id}. Maybe Tutorial was not found!`});
      }
    } catch (err) {
      res.status(500).send({
        message: `Error updating Tutorial with id=${tutorial.id}.`
      });
    }
  }

  async delete(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const num = await tutorialService.delete(id);

      if (num == 1) {
        res.send({
          message: "Tutorial was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Could not delete Tutorial with id==${id}.`
      });
    }
  }

  async deleteAll(req: Request, res: Response) {
    try {
      const num = await tutorialService.deleteAll();

      res.send({ message: `${num} Tutorials were deleted successfully!` });
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while removing all tutorials."
      });
    }
  }

  async findAllPublished(req: Request, res: Response) {
    try {
      const tutorials = await tutorialService.retrieveAll({ published: true });
      if(tutorials.length>0){
        res.status(200).send({msg:"All published tutorials find",data:tutorials});
      }else{
        res.status(200).send({msg:"Published tutorials not found",data:[]});
      }
      
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving tutorials."
      });
    }
  }
}
