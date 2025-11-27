import { FileNode, FileDiff } from './types';

export const INITIAL_FILE_TREE: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    path: 'src',
    children: [
      {
        name: 'controllers',
        type: 'folder',
        path: 'src/controllers',
        children: [
          { name: 'user.controller.ts', type: 'file', path: 'src/controllers/user.controller.ts' },
          { name: 'auth.controller.ts', type: 'file', path: 'src/controllers/auth.controller.ts' },
        ]
      },
      {
        name: 'services',
        type: 'folder',
        path: 'src/services',
        children: [
          { name: 'user.service.ts', type: 'file', path: 'src/services/user.service.ts' },
        ]
      },
      {
        name: 'models',
        type: 'folder',
        path: 'src/models',
        children: [
          { name: 'user.entity.ts', type: 'file', path: 'src/models/user.entity.ts' },
          { name: 'role.entity.ts', type: 'file', path: 'src/models/role.entity.ts' },
        ]
      },
      { name: 'app.ts', type: 'file', path: 'src/app.ts' },
    ]
  },
  { name: 'package.json', type: 'file', path: 'package.json' },
  { name: 'tsconfig.json', type: 'file', path: 'tsconfig.json' },
];

export const MOCK_DIFF_CONTROLLER: FileDiff = {
  filePath: 'src/controllers/user.controller.ts',
  status: 'modified',
  original: `
  @Get('/')
  async getAllUsers() {
    return this.userService.findAll();
  }

  @Get('/:id')
  async getUserById(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
`,
  modified: `
  @Get('/')
  async getAllUsers() {
    return this.userService.findAll();
  }

  @Post('/roles')
  @UseGuards(AdminGuard)
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.userService.createRole(createRoleDto);
  }

  @Get('/:id')
  async getUserById(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
`
};

export const MOCK_DIFF_SERVICE: FileDiff = {
  filePath: 'src/services/user.service.ts',
  status: 'modified',
  original: `
  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findOne(id: string): Promise<User> {
    return this.userRepo.findOne({ where: { id } });
  }
`,
  modified: `
  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async createRole(dto: CreateRoleDto): Promise<Role> {
    // Check if role exists
    const existing = await this.roleRepo.findOne({ name: dto.name });
    if (existing) throw new ConflictException('Role already exists');
    
    const role = this.roleRepo.create(dto);
    return this.roleRepo.save(role);
  }

  async findOne(id: string): Promise<User> {
    return this.userRepo.findOne({ where: { id } });
  }
`
};
