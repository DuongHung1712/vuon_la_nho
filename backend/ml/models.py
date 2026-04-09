import keras
@keras.saving.register_keras_serializable(package='models', name='CBAM')
class CBAM(keras.layers.Layer):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
    
    def call(self, inputs):
        return inputs
