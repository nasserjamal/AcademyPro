import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Badge } from '../../components/UI/Badge';
import { Modal } from '../../components/UI/Modal';
import { ConfirmDialog } from '../../components/UI/ConfirmDialog';
import { useStore } from '../../store/useStore';
import { ArrowLeft, Edit, Clock, Target, Users, Play, Trash2, Save, Upload, X, Plus } from 'lucide-react';

export const DrillDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { drills, updateDrill, deleteDrill } = useStore();
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [equipmentList, setEquipmentList] = useState<string[]>([]);
  const [assessmentParams, setAssessmentParams] = useState<string[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; drillId: string; drillName: string }>({
    isOpen: false,
    drillId: '',
    drillName: ''
  });
  
  const drill = drills.find(d => d.id === id);
  
  if (!drill) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Drill not found</h2>
        <Link to="/drills">
          <Button className="mt-4" icon={ArrowLeft}>Back to Drills</Button>
        </Link>
      </div>
    );
  }

  const getDifficultyBadgeVariant = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'secondary';
    }
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

  const handleEditDrill = (formData: FormData) => {
    const updates = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      difficulty: formData.get('difficulty') as 'beginner' | 'intermediate' | 'advanced',
      duration: parseInt(formData.get('duration') as string),
      equipmentNeeded: equipmentList.filter(item => item.trim() !== ''),
      mediaUrls: selectedImage ? [selectedImage] : drill.mediaUrls,
      assessmentParameters: assessmentParams.filter(param => param.trim() !== ''),
      instructions: instructions.filter(instruction => instruction.trim() !== '')
    };
    
    updateDrill(drill.id, updates);
    setShowEditModal(false);
    resetForm();
  };

  const handleDeleteClick = () => {
    setDeleteConfirm({
      isOpen: true,
      drillId: drill.id,
      drillName: drill.title
    });
  };

  const handleDeleteConfirm = () => {
    deleteDrill(drill.id);
    // Navigate back to drills list
    window.location.href = '/drills';
  };

  const resetForm = () => {
    setSelectedImage(null);
    setInstructions([]);
    setEquipmentList([]);
    setAssessmentParams([]);
  };

  const initializeEditForm = () => {
    setSelectedImage(drill.mediaUrls[0] || null);
    setInstructions([...drill.instructions]);
    setEquipmentList([...drill.equipmentNeeded]);
    setAssessmentParams([...drill.assessmentParameters]);
    setShowEditModal(true);
  };

  const EditDrillForm = () => (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      handleEditDrill(formData);
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
            defaultValue={drill.title}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            defaultValue={drill.description}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category *
          </label>
          <select
            name="category"
            defaultValue={drill.category}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
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
            defaultValue={drill.difficulty}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
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
            defaultValue={drill.duration}
            required
            min="1"
            max="120"
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
          setShowEditModal(false);
          resetForm();
        }}>
          Cancel
        </Button>
        <Button type="submit" icon={Save}>
          Update Drill
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/drills">
            <Button variant="ghost" icon={ArrowLeft} size="small">
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white">
              {drill.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Drill Details
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant={getDifficultyBadgeVariant(drill.difficulty)}>
            {drill.difficulty}
          </Badge>
          <Button icon={Edit} onClick={initializeEditForm}>
            Edit Drill
          </Button>
          <Button 
            variant="danger" 
            icon={Trash2} 
            onClick={handleDeleteClick}
            className="text-red-600 hover:text-red-700 border-red-600 hover:border-red-700"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Edit Drill Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          resetForm();
        }}
        title="Edit Drill"
        size="large"
      >
        <EditDrillForm />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, drillId: '', drillName: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Drill"
        message={`Are you sure you want to delete "${deleteConfirm.drillName}"? This action cannot be undone.`}
        confirmText="Delete Drill"
        variant="danger"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Drill Media */}
          {drill.mediaUrls.length > 0 && (
            <Card>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Drill Demonstration
                </h3>
              </div>
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={drill.mediaUrls[0]} 
                  alt={drill.title}
                  className="w-full h-64 object-cover"
                />
              </div>
            </Card>
          )}

          {/* Drill Information */}
          <Card>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Drill Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</label>
                <p className="text-gray-900 dark:text-white mt-1">{drill.category}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Difficulty</label>
                <div className="mt-1">
                  <Badge variant={getDifficultyBadgeVariant(drill.difficulty)}>
                    {drill.difficulty}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</label>
                <div className="flex items-center mt-1">
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <p className="text-gray-900 dark:text-white">{drill.duration} minutes</p>
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
              <p className="text-gray-900 dark:text-white mt-1">{drill.description}</p>
            </div>
          </Card>

          {/* Equipment Needed */}
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Equipment Needed
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {drill.equipmentNeeded.map((equipment, index) => (
                <Badge key={index} variant="secondary">
                  {equipment}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Skills Developed */}
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Skills Developed
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {drill.assessmentParameters.map((param, index) => (
                <Badge key={index} variant="primary">
                  {param}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Instructions */}
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Step-by-Step Instructions
              </h3>
            </div>
            <div className="space-y-4">
              {drill.instructions.map((instruction, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white">{instruction}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </h3>
            </div>
            <div className="space-y-3">
              <Button className="w-full" icon={Play}>
                Use in Session
              </Button>
              <Button className="w-full" variant="secondary" onClick={initializeEditForm}>
                Edit Drill
              </Button>
              <Button className="w-full" variant="secondary">
                Duplicate Drill
              </Button>
              <Button className="w-full" variant="secondary">
                Share Drill
              </Button>
            </div>
          </Card>

          {/* Drill Stats */}
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Drill Stats
              </h3>
            </div>
            <div className="space-y-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {drill.duration}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Minutes Duration
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {drill.equipmentNeeded.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Equipment Items
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {drill.assessmentParameters.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Skills Developed
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {drill.instructions.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Instruction Steps
                </div>
              </div>
            </div>
          </Card>

          {/* Usage History */}
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Usage History
              </h3>
            </div>
            <div className="space-y-3">
              <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  12
                </div>
                <div className="text-sm text-primary-600 dark:text-primary-400">
                  Times Used
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>Last used: December 23, 2024</p>
                <p>Most used with: U-14 Eagles</p>
                <p>Average rating: 4.5/5</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};