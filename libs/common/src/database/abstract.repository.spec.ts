import { Model, Types } from 'mongoose';
import { AbstractRepository } from './abstract.repository';
import { AbstractDocument } from './abstract.schema';
import { NotFoundException } from '@nestjs/common';

class TestDocument extends AbstractDocument {
  name!: string;
}

class TestRepository extends AbstractRepository<TestDocument> {}

describe('AbstractRepository', () => {
  let repository: TestRepository;
  let MockModel: jest.Mocked<Model<TestDocument>>;

  beforeEach(async () => {
    MockModel = {
      modelName: 'TestModel',
      findOne: jest.fn(),
      find: jest.fn(),
      findOneAndUpdate: jest.fn(),
      findOneAndDelete: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<Model<TestDocument>>;

    repository = new TestRepository(MockModel);
  });

  //TODO: fix this test
  //   describe('create', () => {
  //     it('should create and return a document', async () => {
  //       const document = { name: 'Test' };
  //       const savedDocument = {
  //         ...document,
  //         _id: new Types.ObjectId(),
  //         toJSON: jest.fn().mockReturnValue({
  //           ...document,
  //           _id: new Types.ObjectId(),
  //         }),
  //       };

  //       (MockModel.create as jest.Mock).mockResolvedValue(savedDocument);

  //       const result = await repository.create(document);

  //       expect(result).toEqual(savedDocument.toJSON());
  //       expect(MockModel.create).toHaveBeenCalledWith({
  //         ...document,
  //         _id: expect.any(Types.ObjectId),
  //       });
  //     });
  //   });

  describe('findOne', () => {
    it('should find and return a document', async () => {
      const document = { _id: new Types.ObjectId() };
      (MockModel.findOne as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockReturnValueOnce(document),
      });

      const result = await repository.findOne({ _id: document._id });
      expect(result).toEqual(document);
    });

    it('should throw NotFoundException if document not found', async () => {
      (MockModel.findOne as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockReturnValueOnce(null),
      });

      await expect(
        repository.findOne({ _id: new Types.ObjectId() }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneAndUpdate', () => {
    it('should update and return a document', async () => {
      const document = { _id: new Types.ObjectId() };
      const update = { $set: { name: 'Updated' } };

      (MockModel.findOneAndUpdate as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockReturnValueOnce(document),
      });

      const result = await repository.findOneAndUpdate(
        { _id: document._id },
        update,
      );
      expect(result).toEqual(document);
    });

    it('should throw NotFoundException if document not found for update', async () => {
      (MockModel.findOneAndUpdate as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockReturnValueOnce(null),
      });

      await expect(
        repository.findOneAndUpdate(
          { _id: new Types.ObjectId() },
          { $set: { name: 'Test' } },
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('find', () => {
    it('should find and return documents array', async () => {
      const documents = [{ _id: new Types.ObjectId() }];
      (MockModel.find as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockReturnValueOnce(documents),
      });

      const result = await repository.find({});
      expect(result).toEqual(documents);
    });
  });

  describe('findOneAndDelete', () => {
    it('should delete and return a document', async () => {
      const document = { _id: new Types.ObjectId() };
      (MockModel.findOneAndDelete as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockReturnValueOnce(document),
      });

      const result = await repository.findOneAndDelete({ _id: document._id });
      expect(result).toEqual(document);
    });

    it('should throw NotFoundException if document not found for deletion', async () => {
      (MockModel.findOneAndDelete as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockReturnValueOnce(null),
      });

      await expect(
        repository.findOneAndDelete({ _id: new Types.ObjectId() }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
