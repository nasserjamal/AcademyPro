import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Badge } from '../../components/UI/Badge';
import { Modal } from '../../components/UI/Modal';
import { useStore } from '../../store/useStore';
import { Plus, Search, Filter, Clock, Target, Save, Upload, X } from 'lucide-react';

export const Drills: React.FC = () => {
  const navigate = useNavigate();
  const { drills, addDrill } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [instructions, setInstructions] = useState<string[]>(['']);
  const [equipmentList, setEquipmentList] = useState<string[]>(['']);
  const [assessmentParams, setAssessmentParams] = useState<string[]>(['']);

  const categories = Array.from(new Set(drills.map(drill => drill.category)));
  const difficulties = ['beginner', 'intermediate', 'advanced'];

  const filteredDrills = drills.filter(drill => {
    const matchesSearch = 
      drill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drill.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || drill.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === 'all' || drill.difficulty === difficultyFilter;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyBadgeVariant = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'secondary';
    }
  };

  const handleDrillClick = (drillId: string) => {
    navigate(`/drills/${drillId}`);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const updateInstruction = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const addEquipment = () => {
    setEquipmentList([...equipmentList, '']);
  };

  const removeEquipment = (index: number) => {
    setEquipmentList(equipmentList.filter((_, i) => i !== index));
  };

  const updateEquipment = (index: number, value: string) => {
    const updated = [...equipmentList];
    updated[index] = value;
    setEquipmentList(updated);
  };

  const addAssessmentParam = () => {
    setAssessmentParams([...assessmentParams, '']);
  };

  const removeAssessmentParam = (index: number) => {
    setAssessmentParams(assessmentParams.filter((_, i) => i !== index));
  };

  const updateAssessmentParam = (index: number, value: string) => {
    const updated = [...assessmentParams];
    updated[index] = value;
    setAssessmentParams(updated);
  };

  const handleCreateDrill = (formData: FormData) => {
    const newDrill = {
      id: `drill-${Date.now()}`,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      difficulty: formData.get('difficulty') as 'beginner' | 'intermediate' | 'advanced',
      duration: parseInt(formData.get('duration') as string),
      equipmentNeeded: equipmentList.filter(item => item.trim() !== ''),
      mediaUrls: selectedImage ? [selectedImage] : [],
      assessmentParameters: assessmentParams.filter(param => param.trim() !== ''),
      instructions: instructions.filter(instruction => instruction.trim() !== ''),
      academyId: 'academy-1'
    };
    
    addDrill(newDrill);
    setShowCreateModal(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedImage(null);
    setInstructions(['']);
    setEquipmentList(['']);
    setAssessmentParams(['']);
  };

  const CreateDrillForm = () => (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      handleCreateDrill(formData);
    }}>
      {/* Drill Image Upload Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Drill Image/Video
        </label>
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
            {selectedImage ? (
              <img 
                src={selectedImage} 
                alt="Drill preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <span className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Media
                </span>
              </label>
              {selectedImage && (
                <Button
                  type="button"
                  variant="ghost"
                  size="small"
                  icon={X}
                  onClick={removeImage}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Upload an image or video to demonstrate the drill (optional)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Drill Title *
          </label>
          <input
            type="text"
            name="title"
            required
            placeholder="e.g., Cone Dribbling Challenge"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            required
            rows={3}
            placeholder="Brief description of what this drill teaches and its objectives..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category *
          </label>
          <select
            name="category"
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select Category</option>
            <option value="Technical">Technical</option>
            <option value="Passing">Passing</option>
            <option value="Shooting">Shooting</option>
            <option value="Defending">Defending</option>
            <option value="Fitness">Fitness</option>
            <option value="Tactical">Tactical</option>
            <option value="Goalkeeping">Goalkeeping</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Difficulty Level *
          </label>
          <select
            name="difficulty"
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select Difficulty</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Duration (minutes) *
          </label>
          <input
            type="number"
            name="duration"
            required
            min="1"
            max="120"
            placeholder="15"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Equipment Needed */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Equipment Needed
          </label>
          <Button
            type="button"
            variant="secondary"
            size="small"
            icon={Plus}
            onClick={addEquipment}
          >
            Add Equipment
          </Button>
        </div>
        <div className="space-y-2">
          {equipmentList.map((equipment, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={equipment}
                onChange={(e) => updateEquipment(index, e.target.value)}
                placeholder="e.g., Cones, Footballs, Goals"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {equipmentList.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="small"
                  icon={X}
                  onClick={() => removeEquipment(index)}
                  className="text-red-600 hover:text-red-700"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Assessment Parameters */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Skills Developed
          </label>
          <Button
            type="button"
            variant="secondary"
            size="small"
            icon={Plus}
            onClick={addAssessmentParam}
          >
            Add Skill
          </Button>
        </div>
        <div className="space-y-2">
          {assessmentParams.map((param, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={param}
                onChange={(e) => updateAssessmentParam(index, e.target.value)}
                placeholder="e.g., Ball Control, Passing Accuracy, Speed"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {assessmentParams.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="small"
                  icon={X}
                  onClick={() => removeAssessmentParam(index)}
                  className="text-red-600 hover:text-red-700"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Step-by-Step Instructions
          </label>
          <Button
            type="button"
            variant="secondary"
            size="small"
            icon={Plus}
            onClick={addInstruction}
          >
            Add Step
          </Button>
        </div>
        <div className="space-y-3">
          {instructions.map((instruction, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mt-1">
                <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">
                  {index + 1}
                </span>
              </div>
              <div className="flex-1 flex items-center space-x-2">
                <textarea
                  value={instruction}
                  onChange={(e) => updateInstruction(index, e.target.value)}
                  placeholder={`Step ${index + 1}: Describe what players should do...`}
                  rows={2}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                {instructions.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="small"
                    icon={X}
                    onClick={() => removeInstruction(index)}
                    className="text-red-600 hover:text-red-700"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="secondary" onClick={() => {
          setShowCreateModal(false);
          resetForm();
        }}>
          Cancel
        </Button>
        <Button type="submit" icon={Save}>
          Create Drill
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
            Drills Library
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage training drills and exercises
          </p>
        </div>
        <Button icon={Plus} className="mt-4 sm:mt-0" onClick={() => setShowCreateModal(true)}>
          Create Drill
        </Button>
      </div>

      {/* Create Drill Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        title="Create New Drill"
        size="large"
      >
        <CreateDrillForm />
      </Modal>

      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search drills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Difficulties</option>
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Drills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrills.map((drill) => (
          <Card 
            key={drill.id} 
            className="hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={() => handleDrillClick(drill.id)}
          >
            {/* Drill Image */}
            {drill.mediaUrls.length > 0 && (
              <div className="mb-4 -mx-6 -mt-6">
                <img 
                  src={drill.mediaUrls[0]} 
                  alt={drill.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </div>
            )}

            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                  {drill.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {drill.category}
                </p>
              </div>
              <Badge variant={getDifficultyBadgeVariant(drill.difficulty)}>
                {drill.difficulty}
              </Badge>
            </div>

            <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">
              {drill.description}
            </p>

            {/* Drill Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4 mr-2" />
                {drill.duration} min
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Target className="w-4 h-4 mr-2" />
                {drill.assessmentParameters.length} skills
              </div>
            </div>

            {/* Equipment */}
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">EQUIPMENT NEEDED</p>
              <div className="flex flex-wrap gap-1">
                {drill.equipmentNeeded.slice(0, 3).map((equipment, index) => (
                  <Badge key={index} variant="secondary" size="small">
                    {equipment}
                  </Badge>
                ))}
                {drill.equipmentNeeded.length > 3 && (
                  <Badge variant="secondary" size="small">
                    +{drill.equipmentNeeded.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Assessment Parameters */}
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">SKILLS DEVELOPED</p>
              <div className="flex flex-wrap gap-1">
                {drill.assessmentParameters.slice(0, 2).map((param, index) => (
                  <Badge key={index} variant="primary" size="small">
                    {param}
                  </Badge>
                ))}
                {drill.assessmentParameters.length > 2 && (
                  <Badge variant="primary" size="small">
                    +{drill.assessmentParameters.length - 2} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Instructions Preview */}
            {drill.instructions.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">INSTRUCTIONS</p>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    {drill.instructions.slice(0, 2).map((instruction, index) => (
                      <li key={index} className="flex">
                        <span className="text-primary-500 font-medium mr-2">{index + 1}.</span>
                        <span className="line-clamp-1">{instruction}</span>
                      </li>
                    ))}
                    {drill.instructions.length > 2 && (
                      <li className="text-gray-500 dark:text-gray-400 text-xs">
                        +{drill.instructions.length - 2} more steps...
                      </li>
                    )}
                  </ol>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {filteredDrills.length === 0 && (
        <Card className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            <Target className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No drills found</h3>
            <p className="text-sm mb-4">
              {searchTerm || categoryFilter !== 'all' || difficultyFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Start building your drill library by creating your first drill'
              }
            </p>
            <Button icon={Plus} onClick={() => setShowCreateModal(true)}>
              Create Drill
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};