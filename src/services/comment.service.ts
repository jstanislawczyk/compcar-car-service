import {Service} from 'typedi';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {CommentRepository} from '../repositories/comment.repository';
import {Comment} from '../entities/comment';

@Service()
export class CommentService {

  constructor(
    @InjectRepository()
    private readonly commentRepository: CommentRepository,
  ) {
  }

  public findAll(): Promise<Comment[]> {
    return this.commentRepository.find();
  }

  public saveComment(comment: Comment): Promise<Comment> {
    return this.commentRepository.save(comment);
  }
}
