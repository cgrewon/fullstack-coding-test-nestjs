import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Blog from './blog.entity';
import { validate } from 'class-validator';
import { CreateBlogDto } from './dto/CreateBlogDto';
import { UpdateBlogDto } from './dto/UpdateBlogDto';
import Firebase from 'src/firebase/firebase.client';


@Injectable()
export class BlogService {
    constructor(
        @InjectRepository(Blog)
        private readonly blogRepository: Repository<Blog>
    ){}

    async findAll(){
        const blogs = await (await this.blogRepository.find()).sort((a: Blog,b: Blog)=>a.id < b.id ? -1 : 1);
        return {blogs: blogs}
    }



    async findById(id: number){
        
        const blog = await this.blogRepository.findOne({id: id})

        if(!blog){
            return {
                statud: HttpStatus.BAD_REQUEST,
                message: `There is no blog with id: #${id} ` 
            }
        }

        return {blog};
    }

    async create(createBlogDto: CreateBlogDto) {

        const {title, desc, image} = createBlogDto;

        const docRef = Firebase.firestore().collection('blogs').doc()
        const fid = docRef.id;

        await docRef.set({
            title, 
            desc,
            image,
            created_at:{seconds: Date.now(), nanoseconds:0}
        })
        console.log('fresult : ', fid)


        let newBlog = new Blog();
        newBlog.title = title;
        newBlog.desc = desc;
        newBlog.image = image;
        newBlog.fid = fid;

        const errors = await validate(newBlog);
        
        if (errors.length > 0) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: errors
            }
        } else {
          
            

            const savedBlog = await this.blogRepository.save(newBlog);

           
            return { blog: savedBlog };
        }
        
    }

    async updateById(id:number, updateBlogDto : UpdateBlogDto){
        const blog = await this.blogRepository.findOne({id: id})
        if (!blog) {
            return {
              status: HttpStatus.BAD_REQUEST,
              message: 'There is not blog with this id.'
            }
        }

        await this.blogRepository.update(id, updateBlogDto);

        const updatedBlog = await this.blogRepository.findOne({id: id})

        return {
            blog: updatedBlog
        };

    }



    async remove(id: number) {
        const blog = await this.blogRepository.findOne({ id: id });
        if (!blog) {
          return {
            status: HttpStatus.BAD_REQUEST,
            message: 'There is no blog.'
          }
        }
                
        const res = await Firebase.firestore().collection('blogs').doc(blog.fid).delete()
        console.log('res: ', res, blog.fid)
        await this.blogRepository.delete({ id: id });
        return this.findAll();
    }

}
