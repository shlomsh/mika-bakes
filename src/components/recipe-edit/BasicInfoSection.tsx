import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Image, Loader2 } from 'lucide-react';
import { RecipeEditFormValues } from '@/schemas/recipeEditSchema';

interface BasicInfoSectionProps {
  imagePreview: string | null;
  isUploading: boolean;
  uploadError: string | null;
  onPickFile: (file: File) => void;
  recipeName: string;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ imagePreview, isUploading, uploadError, onPickFile, recipeName }) => {
  const { control } = useFormContext<RecipeEditFormValues>();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-fredoka text-3xl text-choco">עריכת מתכון: {recipeName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>שם המתכון</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>תיאור</FormLabel>
              <FormControl><Textarea {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>תמונת מתכון</FormLabel>
          {imagePreview && (
            <div className="mt-2 mb-4 relative">
              <img
                src={imagePreview}
                alt="תצוגה מקדימה"
                className="w-full max-w-sm rounded-lg object-cover shadow-md hover:shadow-lg transition-shadow duration-200"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                </div>
              )}
            </div>
          )}
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleButtonClick}
              disabled={isUploading}
              className="w-full sm:w-auto bg-pastelYellow/20 border-pastelYellow hover:bg-pastelYellow/40 text-choco font-fredoka transition-all duration-200 hover:scale-105 active:scale-95"
            >
              {isUploading ? (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="ml-2 h-4 w-4" />
              )}
              {isUploading ? 'מעלה...' : imagePreview ? 'שנה תמונה' : 'העלה תמונה'}
            </Button>
            <p className="text-sm text-choco/60 flex items-center gap-1">
              <Image className="h-3 w-3" />
              קבצי תמונה בלבד (JPG, PNG, WebP)
            </p>
            {uploadError && (
              <p className="text-sm text-destructive">{uploadError}</p>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onPickFile(file);
              event.target.value = '';
            }}
          />
        </FormItem>
      </CardContent>
    </Card>
  );
};

export default BasicInfoSection;
