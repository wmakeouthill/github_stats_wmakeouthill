import { GitHubProfile } from '@/shared/types/github.types';

export interface ProfileCardProps {
    profile: GitHubProfile;
    className?: string;
    actionButton?: React.ReactNode;
}
