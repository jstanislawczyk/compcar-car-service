import {EntityRepository, Repository} from 'typeorm';
import {Comment} from '../models/entities/comment';

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {

}
